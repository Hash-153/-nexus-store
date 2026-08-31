import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemorySupportTicketRepository } from "../infrastructure/InMemorySupportTicketRepository.ts";
import { InMemoryTicketMessageRepository } from "../infrastructure/InMemoryTicketMessageRepository.ts";
import { InMemoryTicketAttachmentRepository } from "../infrastructure/InMemoryTicketAttachmentRepository.ts";
import { InMemorySlaPolicyRepository } from "../infrastructure/InMemorySlaPolicyRepository.ts";
import { InMemoryCannedResponseRepository } from "../infrastructure/InMemoryCannedResponseRepository.ts";
import { InMemoryCustomerFeedbackSurveyRepository } from "../infrastructure/InMemoryCustomerFeedbackSurveyRepository.ts";
import { InMemorySupportAgentProfileRepository } from "../infrastructure/InMemorySupportAgentProfileRepository.ts";
import { InMemoryEscalationRuleRepository } from "../infrastructure/InMemoryEscalationRuleRepository.ts";
import { CreateTicketUseCase } from "./CreateTicketUseCase.ts";
import { ReplyToTicketUseCase } from "./ReplyToTicketUseCase.ts";
import { AssignTicketUseCase } from "./AssignTicketUseCase.ts";
import { ChangeTicketStatusUseCase } from "./ChangeTicketStatusUseCase.ts";
import { EscalateTicketUseCase } from "./EscalateTicketUseCase.ts";
import { ApplyCannedResponseUseCase } from "./ApplyCannedResponseUseCase.ts";
import { SubmitFeedbackSurveyUseCase } from "./SubmitFeedbackSurveyUseCase.ts";
import { GetCustomerTicketsUseCase } from "./GetCustomerTicketsUseCase.ts";
import { GetAgentPerformanceMetricsUseCase } from "./GetAgentPerformanceMetricsUseCase.ts";

export interface CustomerSupportModuleContext {
  supportTicketRepo: InMemorySupportTicketRepository;
  ticketMessageRepo: InMemoryTicketMessageRepository;
  ticketAttachmentRepo: InMemoryTicketAttachmentRepository;
  slaPolicyRepo: InMemorySlaPolicyRepository;
  cannedResponseRepo: InMemoryCannedResponseRepository;
  customerFeedbackSurveyRepo: InMemoryCustomerFeedbackSurveyRepository;
  supportAgentProfileRepo: InMemorySupportAgentProfileRepository;
  escalationRuleRepo: InMemoryEscalationRuleRepository;
  createTicketUseCase: CreateTicketUseCase;
  replyToTicketUseCase: ReplyToTicketUseCase;
  assignTicketUseCase: AssignTicketUseCase;
  changeTicketStatusUseCase: ChangeTicketStatusUseCase;
  escalateTicketUseCase: EscalateTicketUseCase;
  applyCannedResponseUseCase: ApplyCannedResponseUseCase;
  submitFeedbackSurveyUseCase: SubmitFeedbackSurveyUseCase;
  getCustomerTicketsUseCase: GetCustomerTicketsUseCase;
  getAgentPerformanceMetricsUseCase: GetAgentPerformanceMetricsUseCase;
}

export class CustomerSupportController {
  private readonly context: CustomerSupportModuleContext;

  constructor(eventBus: IEventBus) {
    const supportTicketRepo = new InMemorySupportTicketRepository();
    const ticketMessageRepo = new InMemoryTicketMessageRepository();
    const ticketAttachmentRepo = new InMemoryTicketAttachmentRepository();
    const slaPolicyRepo = new InMemorySlaPolicyRepository();
    const cannedResponseRepo = new InMemoryCannedResponseRepository();
    const customerFeedbackSurveyRepo = new InMemoryCustomerFeedbackSurveyRepository();
    const supportAgentProfileRepo = new InMemorySupportAgentProfileRepository();
    const escalationRuleRepo = new InMemoryEscalationRuleRepository();
    
    const createTicketUseCase = new CreateTicketUseCase(supportTicketRepo, eventBus);
    const replyToTicketUseCase = new ReplyToTicketUseCase(ticketMessageRepo, eventBus);
    const assignTicketUseCase = new AssignTicketUseCase(ticketAttachmentRepo, eventBus);
    const changeTicketStatusUseCase = new ChangeTicketStatusUseCase(slaPolicyRepo, eventBus);
    const escalateTicketUseCase = new EscalateTicketUseCase(cannedResponseRepo, eventBus);
    const applyCannedResponseUseCase = new ApplyCannedResponseUseCase(customerFeedbackSurveyRepo, eventBus);
    const submitFeedbackSurveyUseCase = new SubmitFeedbackSurveyUseCase(supportAgentProfileRepo, eventBus);
    const getCustomerTicketsUseCase = new GetCustomerTicketsUseCase(escalationRuleRepo, eventBus);
    const getAgentPerformanceMetricsUseCase = new GetAgentPerformanceMetricsUseCase(supportTicketRepo, eventBus);

    this.context = {
      supportTicketRepo,
      ticketMessageRepo,
      ticketAttachmentRepo,
      slaPolicyRepo,
      cannedResponseRepo,
      customerFeedbackSurveyRepo,
      supportAgentProfileRepo,
      escalationRuleRepo,
      createTicketUseCase,
      replyToTicketUseCase,
      assignTicketUseCase,
      changeTicketStatusUseCase,
      escalateTicketUseCase,
      applyCannedResponseUseCase,
      submitFeedbackSurveyUseCase,
      getCustomerTicketsUseCase,
      getAgentPerformanceMetricsUseCase,
    };
  }

  public getContext(): CustomerSupportModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/customer-support";

    
    router.register("GET", `${basePath}/supporttickets`, async (req, res) => {
      const items = await this.context.supportTicketRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/supporttickets/:id`, async (req, res, params) => {
      const item = await this.context.supportTicketRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SupportTicket not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ticketmessages`, async (req, res) => {
      const items = await this.context.ticketMessageRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ticketmessages/:id`, async (req, res, params) => {
      const item = await this.context.ticketMessageRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TicketMessage not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ticketattachments`, async (req, res) => {
      const items = await this.context.ticketAttachmentRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ticketattachments/:id`, async (req, res, params) => {
      const item = await this.context.ticketAttachmentRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TicketAttachment not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/slapolicys`, async (req, res) => {
      const items = await this.context.slaPolicyRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/slapolicys/:id`, async (req, res, params) => {
      const item = await this.context.slaPolicyRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SlaPolicy not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/cannedresponses`, async (req, res) => {
      const items = await this.context.cannedResponseRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/cannedresponses/:id`, async (req, res, params) => {
      const item = await this.context.cannedResponseRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CannedResponse not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/customerfeedbacksurveys`, async (req, res) => {
      const items = await this.context.customerFeedbackSurveyRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/customerfeedbacksurveys/:id`, async (req, res, params) => {
      const item = await this.context.customerFeedbackSurveyRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CustomerFeedbackSurvey not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/supportagentprofiles`, async (req, res) => {
      const items = await this.context.supportAgentProfileRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/supportagentprofiles/:id`, async (req, res, params) => {
      const item = await this.context.supportAgentProfileRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SupportAgentProfile not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/escalationrules`, async (req, res) => {
      const items = await this.context.escalationRuleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/escalationrules/:id`, async (req, res, params) => {
      const item = await this.context.escalationRuleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "EscalationRule not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createticket`, async (req, res, params, body) => {
      const result = await this.context.createTicketUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/replytoticket`, async (req, res, params, body) => {
      const result = await this.context.replyToTicketUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/assignticket`, async (req, res, params, body) => {
      const result = await this.context.assignTicketUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/changeticketstatus`, async (req, res, params, body) => {
      const result = await this.context.changeTicketStatusUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/escalateticket`, async (req, res, params, body) => {
      const result = await this.context.escalateTicketUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/applycannedresponse`, async (req, res, params, body) => {
      const result = await this.context.applyCannedResponseUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/submitfeedbacksurvey`, async (req, res, params, body) => {
      const result = await this.context.submitFeedbackSurveyUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getcustomertickets`, async (req, res, params, body) => {
      const result = await this.context.getCustomerTicketsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getagentperformancemetrics`, async (req, res, params, body) => {
      const result = await this.context.getAgentPerformanceMetricsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
