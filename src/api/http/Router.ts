import { IncomingMessage, ServerResponse } from "node:http";
import { ApplicationContainer } from "../Container.ts";
import { DomainError } from "../../shared/errors/DomainError.ts";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, string>,
  body: any,
  container: ReturnType<typeof ApplicationContainer.create>
) => Promise<void> | void;

interface Route {
  method: HttpMethod;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  public register(method: HttpMethod, path: string, handler: RouteHandler): void {
    const paramNames: string[] = [];
    const patternStr = path.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });
    const pattern = new RegExp(`^${patternStr}$`);

    this.routes.push({
      method,
      pattern,
      paramNames,
      handler,
    });
  }

  public async handle(
    req: IncomingMessage,
    res: ServerResponse,
    container: ReturnType<typeof ApplicationContainer.create>
  ): Promise<void> {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;
    const method = (req.method || "GET").toUpperCase() as HttpMethod;

    for (const route of this.routes) {
      if (route.method === method) {
        const match = pathname.match(route.pattern);
        if (match) {
          const params: Record<string, string> = {};
          route.paramNames.forEach((name, index) => {
            params[name] = decodeURIComponent(match[index + 1]);
          });

          try {
            let body: any = null;
            if (method === "POST" || method === "PUT" || method === "PATCH") {
              body = await this.parseJsonBody(req);
            }

            await route.handler(req, res, params, body, container);
          } catch (error: any) {
            this.handleError(res, error);
          }
          return;
        }
      }
    }

    this.sendJson(res, 404, {
      success: false,
      error: { code: "NOT_FOUND", message: `Route ${method} ${pathname} not found` },
    });
  }

  public sendJson(res: ServerResponse, statusCode: number, data: any): void {
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify(data, null, 2));
  }

  private handleError(res: ServerResponse, error: any): void {
    if (error instanceof DomainError) {
      let statusCode = 400;
      if (error.code === "NOT_FOUND_ERROR") statusCode = 404;
      if (error.code === "UNAUTHORIZED_ERROR") statusCode = 401;
      if (error.code === "FORBIDDEN_ERROR") statusCode = 403;
      if (error.code === "CONFLICT_ERROR") statusCode = 409;
      if (error.code === "VALIDATION_ERROR") statusCode = 422;

      this.sendJson(res, statusCode, {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          errors: (error as any).errors,
        },
      });
      return;
    }

    console.error("[ServerError]", error);
    this.sendJson(res, 500, {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
      },
    });
  }

  private async parseJsonBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
        if (data.length > 1024 * 1024) {
          // 1MB body limit
          reject(new Error("Request payload too large"));
        }
      });
      req.on("end", () => {
        if (!data.trim()) {
          resolve({});
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Malformed JSON in request body"));
        }
      });
      req.on("error", reject);
    });
  }
}
