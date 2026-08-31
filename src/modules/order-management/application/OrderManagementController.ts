import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryOrderRepository } from "../infrastructure/InMemoryOrderRepository.ts";
import { InMemoryOrderItemRepository } from "../infrastructure/InMemoryOrderItemRepository.ts";
import { InMemoryOrderAddressRepository } from "../infrastructure/InMemoryOrderAddressRepository.ts";
import { InMemoryOrderFulfillmentRepository } from "../infrastructure/InMemoryOrderFulfillmentRepository.ts";
import { InMemoryOrderNoteRepository } from "../infrastructure/InMemoryOrderNoteRepository.ts";
import { InMemoryOrderTimelineEventRepository } from "../infrastructure/InMemoryOrderTimelineEventRepository.ts";
import { InMemoryOrderCancellationRepository } from "../infrastructure/InMemoryOrderCancellationRepository.ts";
import { InMemoryReturnRequestRepository } from "../infrastructure/InMemoryReturnRequestRepository.ts";
import { InMemoryReturnItemRepository } from "../infrastructure/InMemoryReturnItemRepository.ts";
import { InMemoryExchangeOrderRepository } from "../infrastructure/InMemoryExchangeOrderRepository.ts";
import { InMemoryInvoiceRepository } from "../infrastructure/InMemoryInvoiceRepository.ts";
import { InMemoryCreditNoteRepository } from "../infrastructure/InMemoryCreditNoteRepository.ts";
import { CreateOrderFromCartUseCase } from "./CreateOrderFromCartUseCase.ts";
import { GetOrderByIdUseCase } from "./GetOrderByIdUseCase.ts";
import { ListOrdersUseCase } from "./ListOrdersUseCase.ts";
import { UpdateOrderStatusUseCase } from "./UpdateOrderStatusUseCase.ts";
import { CancelOrderUseCase } from "./CancelOrderUseCase.ts";
import { CreateOrderFulfillmentUseCase } from "./CreateOrderFulfillmentUseCase.ts";
import { GenerateInvoiceUseCase } from "./GenerateInvoiceUseCase.ts";
import { ProcessReturnRequestUseCase } from "./ProcessReturnRequestUseCase.ts";
import { ApproveReturnUseCase } from "./ApproveReturnUseCase.ts";
import { RejectReturnUseCase } from "./RejectReturnUseCase.ts";
import { CreateExchangeOrderUseCase } from "./CreateExchangeOrderUseCase.ts";
import { AddOrderNoteUseCase } from "./AddOrderNoteUseCase.ts";
import { GetOrderTimelineUseCase } from "./GetOrderTimelineUseCase.ts";
import { ExportOrderReportUseCase } from "./ExportOrderReportUseCase.ts";

export interface OrderManagementModuleContext {
  orderRepo: InMemoryOrderRepository;
  orderItemRepo: InMemoryOrderItemRepository;
  orderAddressRepo: InMemoryOrderAddressRepository;
  orderFulfillmentRepo: InMemoryOrderFulfillmentRepository;
  orderNoteRepo: InMemoryOrderNoteRepository;
  orderTimelineEventRepo: InMemoryOrderTimelineEventRepository;
  orderCancellationRepo: InMemoryOrderCancellationRepository;
  returnRequestRepo: InMemoryReturnRequestRepository;
  returnItemRepo: InMemoryReturnItemRepository;
  exchangeOrderRepo: InMemoryExchangeOrderRepository;
  invoiceRepo: InMemoryInvoiceRepository;
  creditNoteRepo: InMemoryCreditNoteRepository;
  createOrderFromCartUseCase: CreateOrderFromCartUseCase;
  getOrderByIdUseCase: GetOrderByIdUseCase;
  listOrdersUseCase: ListOrdersUseCase;
  updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  cancelOrderUseCase: CancelOrderUseCase;
  createOrderFulfillmentUseCase: CreateOrderFulfillmentUseCase;
  generateInvoiceUseCase: GenerateInvoiceUseCase;
  processReturnRequestUseCase: ProcessReturnRequestUseCase;
  approveReturnUseCase: ApproveReturnUseCase;
  rejectReturnUseCase: RejectReturnUseCase;
  createExchangeOrderUseCase: CreateExchangeOrderUseCase;
  addOrderNoteUseCase: AddOrderNoteUseCase;
  getOrderTimelineUseCase: GetOrderTimelineUseCase;
  exportOrderReportUseCase: ExportOrderReportUseCase;
}

export class OrderManagementController {
  private readonly context: OrderManagementModuleContext;

  constructor(eventBus: IEventBus) {
    const orderRepo = new InMemoryOrderRepository();
    const orderItemRepo = new InMemoryOrderItemRepository();
    const orderAddressRepo = new InMemoryOrderAddressRepository();
    const orderFulfillmentRepo = new InMemoryOrderFulfillmentRepository();
    const orderNoteRepo = new InMemoryOrderNoteRepository();
    const orderTimelineEventRepo = new InMemoryOrderTimelineEventRepository();
    const orderCancellationRepo = new InMemoryOrderCancellationRepository();
    const returnRequestRepo = new InMemoryReturnRequestRepository();
    const returnItemRepo = new InMemoryReturnItemRepository();
    const exchangeOrderRepo = new InMemoryExchangeOrderRepository();
    const invoiceRepo = new InMemoryInvoiceRepository();
    const creditNoteRepo = new InMemoryCreditNoteRepository();
    
    const createOrderFromCartUseCase = new CreateOrderFromCartUseCase(orderRepo, eventBus);
    const getOrderByIdUseCase = new GetOrderByIdUseCase(orderItemRepo, eventBus);
    const listOrdersUseCase = new ListOrdersUseCase(orderAddressRepo, eventBus);
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderFulfillmentRepo, eventBus);
    const cancelOrderUseCase = new CancelOrderUseCase(orderNoteRepo, eventBus);
    const createOrderFulfillmentUseCase = new CreateOrderFulfillmentUseCase(orderTimelineEventRepo, eventBus);
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(orderCancellationRepo, eventBus);
    const processReturnRequestUseCase = new ProcessReturnRequestUseCase(returnRequestRepo, eventBus);
    const approveReturnUseCase = new ApproveReturnUseCase(returnItemRepo, eventBus);
    const rejectReturnUseCase = new RejectReturnUseCase(exchangeOrderRepo, eventBus);
    const createExchangeOrderUseCase = new CreateExchangeOrderUseCase(invoiceRepo, eventBus);
    const addOrderNoteUseCase = new AddOrderNoteUseCase(creditNoteRepo, eventBus);
    const getOrderTimelineUseCase = new GetOrderTimelineUseCase(orderRepo, eventBus);
    const exportOrderReportUseCase = new ExportOrderReportUseCase(orderItemRepo, eventBus);

    this.context = {
      orderRepo,
      orderItemRepo,
      orderAddressRepo,
      orderFulfillmentRepo,
      orderNoteRepo,
      orderTimelineEventRepo,
      orderCancellationRepo,
      returnRequestRepo,
      returnItemRepo,
      exchangeOrderRepo,
      invoiceRepo,
      creditNoteRepo,
      createOrderFromCartUseCase,
      getOrderByIdUseCase,
      listOrdersUseCase,
      updateOrderStatusUseCase,
      cancelOrderUseCase,
      createOrderFulfillmentUseCase,
      generateInvoiceUseCase,
      processReturnRequestUseCase,
      approveReturnUseCase,
      rejectReturnUseCase,
      createExchangeOrderUseCase,
      addOrderNoteUseCase,
      getOrderTimelineUseCase,
      exportOrderReportUseCase,
    };
  }

  public getContext(): OrderManagementModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/order-management";

    
    router.register("GET", `${basePath}/orders`, async (req, res) => {
      const items = await this.context.orderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/orders/:id`, async (req, res, params) => {
      const item = await this.context.orderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Order not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/orderitems`, async (req, res) => {
      const items = await this.context.orderItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/orderitems/:id`, async (req, res, params) => {
      const item = await this.context.orderItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/orderaddresss`, async (req, res) => {
      const items = await this.context.orderAddressRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/orderaddresss/:id`, async (req, res, params) => {
      const item = await this.context.orderAddressRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderAddress not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/orderfulfillments`, async (req, res) => {
      const items = await this.context.orderFulfillmentRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/orderfulfillments/:id`, async (req, res, params) => {
      const item = await this.context.orderFulfillmentRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderFulfillment not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ordernotes`, async (req, res) => {
      const items = await this.context.orderNoteRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ordernotes/:id`, async (req, res, params) => {
      const item = await this.context.orderNoteRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderNote not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ordertimelineevents`, async (req, res) => {
      const items = await this.context.orderTimelineEventRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ordertimelineevents/:id`, async (req, res, params) => {
      const item = await this.context.orderTimelineEventRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderTimelineEvent not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ordercancellations`, async (req, res) => {
      const items = await this.context.orderCancellationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ordercancellations/:id`, async (req, res, params) => {
      const item = await this.context.orderCancellationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "OrderCancellation not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/returnrequests`, async (req, res) => {
      const items = await this.context.returnRequestRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/returnrequests/:id`, async (req, res, params) => {
      const item = await this.context.returnRequestRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ReturnRequest not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/returnitems`, async (req, res) => {
      const items = await this.context.returnItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/returnitems/:id`, async (req, res, params) => {
      const item = await this.context.returnItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ReturnItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/exchangeorders`, async (req, res) => {
      const items = await this.context.exchangeOrderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/exchangeorders/:id`, async (req, res, params) => {
      const item = await this.context.exchangeOrderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ExchangeOrder not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/invoices`, async (req, res) => {
      const items = await this.context.invoiceRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/invoices/:id`, async (req, res, params) => {
      const item = await this.context.invoiceRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Invoice not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/creditnotes`, async (req, res) => {
      const items = await this.context.creditNoteRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/creditnotes/:id`, async (req, res, params) => {
      const item = await this.context.creditNoteRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CreditNote not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createorderfromcart`, async (req, res, params, body) => {
      const result = await this.context.createOrderFromCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getorderbyid`, async (req, res, params, body) => {
      const result = await this.context.getOrderByIdUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/listorders`, async (req, res, params, body) => {
      const result = await this.context.listOrdersUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updateorderstatus`, async (req, res, params, body) => {
      const result = await this.context.updateOrderStatusUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/cancelorder`, async (req, res, params, body) => {
      const result = await this.context.cancelOrderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createorderfulfillment`, async (req, res, params, body) => {
      const result = await this.context.createOrderFulfillmentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generateinvoice`, async (req, res, params, body) => {
      const result = await this.context.generateInvoiceUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/processreturnrequest`, async (req, res, params, body) => {
      const result = await this.context.processReturnRequestUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/approvereturn`, async (req, res, params, body) => {
      const result = await this.context.approveReturnUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/rejectreturn`, async (req, res, params, body) => {
      const result = await this.context.rejectReturnUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createexchangeorder`, async (req, res, params, body) => {
      const result = await this.context.createExchangeOrderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/addordernote`, async (req, res, params, body) => {
      const result = await this.context.addOrderNoteUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getordertimeline`, async (req, res, params, body) => {
      const result = await this.context.getOrderTimelineUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/exportorderreport`, async (req, res, params, body) => {
      const result = await this.context.exportOrderReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
