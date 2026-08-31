import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryPaymentTransactionRepository } from "../infrastructure/InMemoryPaymentTransactionRepository.ts";
import { InMemoryPaymentMethodRecordRepository } from "../infrastructure/InMemoryPaymentMethodRecordRepository.ts";
import { InMemoryRefundTransactionRepository } from "../infrastructure/InMemoryRefundTransactionRepository.ts";
import { InMemoryChargebackRecordRepository } from "../infrastructure/InMemoryChargebackRecordRepository.ts";
import { InMemoryEscrowAccountRepository } from "../infrastructure/InMemoryEscrowAccountRepository.ts";
import { InMemoryPaymentTokenVaultRepository } from "../infrastructure/InMemoryPaymentTokenVaultRepository.ts";
import { InMemoryFraudAssessmentRepository } from "../infrastructure/InMemoryFraudAssessmentRepository.ts";
import { InMemoryGatewayWebhookLogRepository } from "../infrastructure/InMemoryGatewayWebhookLogRepository.ts";
import { ProcessPaymentUseCase } from "./ProcessPaymentUseCase.ts";
import { AuthorizePaymentUseCase } from "./AuthorizePaymentUseCase.ts";
import { CapturePaymentUseCase } from "./CapturePaymentUseCase.ts";
import { RefundPaymentUseCase } from "./RefundPaymentUseCase.ts";
import { HandlePaymentWebhookUseCase } from "./HandlePaymentWebhookUseCase.ts";
import { AssessFraudRiskUseCase } from "./AssessFraudRiskUseCase.ts";
import { StorePaymentMethodTokenUseCase } from "./StorePaymentMethodTokenUseCase.ts";
import { DeletePaymentMethodTokenUseCase } from "./DeletePaymentMethodTokenUseCase.ts";
import { GetTransactionHistoryUseCase } from "./GetTransactionHistoryUseCase.ts";
import { ProcessChargebackNoticeUseCase } from "./ProcessChargebackNoticeUseCase.ts";

export interface PaymentProcessingModuleContext {
  paymentTransactionRepo: InMemoryPaymentTransactionRepository;
  paymentMethodRecordRepo: InMemoryPaymentMethodRecordRepository;
  refundTransactionRepo: InMemoryRefundTransactionRepository;
  chargebackRecordRepo: InMemoryChargebackRecordRepository;
  escrowAccountRepo: InMemoryEscrowAccountRepository;
  paymentTokenVaultRepo: InMemoryPaymentTokenVaultRepository;
  fraudAssessmentRepo: InMemoryFraudAssessmentRepository;
  gatewayWebhookLogRepo: InMemoryGatewayWebhookLogRepository;
  processPaymentUseCase: ProcessPaymentUseCase;
  authorizePaymentUseCase: AuthorizePaymentUseCase;
  capturePaymentUseCase: CapturePaymentUseCase;
  refundPaymentUseCase: RefundPaymentUseCase;
  handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase;
  assessFraudRiskUseCase: AssessFraudRiskUseCase;
  storePaymentMethodTokenUseCase: StorePaymentMethodTokenUseCase;
  deletePaymentMethodTokenUseCase: DeletePaymentMethodTokenUseCase;
  getTransactionHistoryUseCase: GetTransactionHistoryUseCase;
  processChargebackNoticeUseCase: ProcessChargebackNoticeUseCase;
}

export class PaymentProcessingController {
  private readonly context: PaymentProcessingModuleContext;

  constructor(eventBus: IEventBus) {
    const paymentTransactionRepo = new InMemoryPaymentTransactionRepository();
    const paymentMethodRecordRepo = new InMemoryPaymentMethodRecordRepository();
    const refundTransactionRepo = new InMemoryRefundTransactionRepository();
    const chargebackRecordRepo = new InMemoryChargebackRecordRepository();
    const escrowAccountRepo = new InMemoryEscrowAccountRepository();
    const paymentTokenVaultRepo = new InMemoryPaymentTokenVaultRepository();
    const fraudAssessmentRepo = new InMemoryFraudAssessmentRepository();
    const gatewayWebhookLogRepo = new InMemoryGatewayWebhookLogRepository();
    
    const processPaymentUseCase = new ProcessPaymentUseCase(paymentTransactionRepo, eventBus);
    const authorizePaymentUseCase = new AuthorizePaymentUseCase(paymentMethodRecordRepo, eventBus);
    const capturePaymentUseCase = new CapturePaymentUseCase(refundTransactionRepo, eventBus);
    const refundPaymentUseCase = new RefundPaymentUseCase(chargebackRecordRepo, eventBus);
    const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase(escrowAccountRepo, eventBus);
    const assessFraudRiskUseCase = new AssessFraudRiskUseCase(paymentTokenVaultRepo, eventBus);
    const storePaymentMethodTokenUseCase = new StorePaymentMethodTokenUseCase(fraudAssessmentRepo, eventBus);
    const deletePaymentMethodTokenUseCase = new DeletePaymentMethodTokenUseCase(gatewayWebhookLogRepo, eventBus);
    const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(paymentTransactionRepo, eventBus);
    const processChargebackNoticeUseCase = new ProcessChargebackNoticeUseCase(paymentMethodRecordRepo, eventBus);

    this.context = {
      paymentTransactionRepo,
      paymentMethodRecordRepo,
      refundTransactionRepo,
      chargebackRecordRepo,
      escrowAccountRepo,
      paymentTokenVaultRepo,
      fraudAssessmentRepo,
      gatewayWebhookLogRepo,
      processPaymentUseCase,
      authorizePaymentUseCase,
      capturePaymentUseCase,
      refundPaymentUseCase,
      handlePaymentWebhookUseCase,
      assessFraudRiskUseCase,
      storePaymentMethodTokenUseCase,
      deletePaymentMethodTokenUseCase,
      getTransactionHistoryUseCase,
      processChargebackNoticeUseCase,
    };
  }

  public getContext(): PaymentProcessingModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/payment-processing";

    
    router.register("GET", `${basePath}/paymenttransactions`, async (req, res) => {
      const items = await this.context.paymentTransactionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/paymenttransactions/:id`, async (req, res, params) => {
      const item = await this.context.paymentTransactionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PaymentTransaction not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/paymentmethodrecords`, async (req, res) => {
      const items = await this.context.paymentMethodRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/paymentmethodrecords/:id`, async (req, res, params) => {
      const item = await this.context.paymentMethodRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PaymentMethodRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/refundtransactions`, async (req, res) => {
      const items = await this.context.refundTransactionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/refundtransactions/:id`, async (req, res, params) => {
      const item = await this.context.refundTransactionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RefundTransaction not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/chargebackrecords`, async (req, res) => {
      const items = await this.context.chargebackRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/chargebackrecords/:id`, async (req, res, params) => {
      const item = await this.context.chargebackRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ChargebackRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/escrowaccounts`, async (req, res) => {
      const items = await this.context.escrowAccountRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/escrowaccounts/:id`, async (req, res, params) => {
      const item = await this.context.escrowAccountRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "EscrowAccount not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/paymenttokenvaults`, async (req, res) => {
      const items = await this.context.paymentTokenVaultRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/paymenttokenvaults/:id`, async (req, res, params) => {
      const item = await this.context.paymentTokenVaultRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PaymentTokenVault not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/fraudassessments`, async (req, res) => {
      const items = await this.context.fraudAssessmentRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/fraudassessments/:id`, async (req, res, params) => {
      const item = await this.context.fraudAssessmentRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "FraudAssessment not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/gatewaywebhooklogs`, async (req, res) => {
      const items = await this.context.gatewayWebhookLogRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/gatewaywebhooklogs/:id`, async (req, res, params) => {
      const item = await this.context.gatewayWebhookLogRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "GatewayWebhookLog not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/processpayment`, async (req, res, params, body) => {
      const result = await this.context.processPaymentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/authorizepayment`, async (req, res, params, body) => {
      const result = await this.context.authorizePaymentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/capturepayment`, async (req, res, params, body) => {
      const result = await this.context.capturePaymentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/refundpayment`, async (req, res, params, body) => {
      const result = await this.context.refundPaymentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/handlepaymentwebhook`, async (req, res, params, body) => {
      const result = await this.context.handlePaymentWebhookUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/assessfraudrisk`, async (req, res, params, body) => {
      const result = await this.context.assessFraudRiskUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/storepaymentmethodtoken`, async (req, res, params, body) => {
      const result = await this.context.storePaymentMethodTokenUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/deletepaymentmethodtoken`, async (req, res, params, body) => {
      const result = await this.context.deletePaymentMethodTokenUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/gettransactionhistory`, async (req, res, params, body) => {
      const result = await this.context.getTransactionHistoryUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/processchargebacknotice`, async (req, res, params, body) => {
      const result = await this.context.processChargebackNoticeUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
