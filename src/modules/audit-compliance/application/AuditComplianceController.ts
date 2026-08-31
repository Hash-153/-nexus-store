import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryAuditRecordRepository } from "../infrastructure/InMemoryAuditRecordRepository.ts";
import { InMemoryGdprConsentRecordRepository } from "../infrastructure/InMemoryGdprConsentRecordRepository.ts";
import { InMemoryDataExportRequestRepository } from "../infrastructure/InMemoryDataExportRequestRepository.ts";
import { InMemoryDataDeletionRequestRepository } from "../infrastructure/InMemoryDataDeletionRequestRepository.ts";
import { InMemorySecurityAlertRepository } from "../infrastructure/InMemorySecurityAlertRepository.ts";
import { InMemoryIpAccessLogRepository } from "../infrastructure/InMemoryIpAccessLogRepository.ts";
import { InMemoryCompliancePolicyRepository } from "../infrastructure/InMemoryCompliancePolicyRepository.ts";
import { RecordAuditActionUseCase } from "./RecordAuditActionUseCase.ts";
import { RecordGdprConsentUseCase } from "./RecordGdprConsentUseCase.ts";
import { RequestDataExportUseCase } from "./RequestDataExportUseCase.ts";
import { ProcessDataDeletionUseCase } from "./ProcessDataDeletionUseCase.ts";
import { LogSecurityEventUseCase } from "./LogSecurityEventUseCase.ts";
import { GetAuditTrailByEntityUseCase } from "./GetAuditTrailByEntityUseCase.ts";
import { GenerateComplianceReportUseCase } from "./GenerateComplianceReportUseCase.ts";

export interface AuditComplianceModuleContext {
  auditRecordRepo: InMemoryAuditRecordRepository;
  gdprConsentRecordRepo: InMemoryGdprConsentRecordRepository;
  dataExportRequestRepo: InMemoryDataExportRequestRepository;
  dataDeletionRequestRepo: InMemoryDataDeletionRequestRepository;
  securityAlertRepo: InMemorySecurityAlertRepository;
  ipAccessLogRepo: InMemoryIpAccessLogRepository;
  compliancePolicyRepo: InMemoryCompliancePolicyRepository;
  recordAuditActionUseCase: RecordAuditActionUseCase;
  recordGdprConsentUseCase: RecordGdprConsentUseCase;
  requestDataExportUseCase: RequestDataExportUseCase;
  processDataDeletionUseCase: ProcessDataDeletionUseCase;
  logSecurityEventUseCase: LogSecurityEventUseCase;
  getAuditTrailByEntityUseCase: GetAuditTrailByEntityUseCase;
  generateComplianceReportUseCase: GenerateComplianceReportUseCase;
}

export class AuditComplianceController {
  private readonly context: AuditComplianceModuleContext;

  constructor(eventBus: IEventBus) {
    const auditRecordRepo = new InMemoryAuditRecordRepository();
    const gdprConsentRecordRepo = new InMemoryGdprConsentRecordRepository();
    const dataExportRequestRepo = new InMemoryDataExportRequestRepository();
    const dataDeletionRequestRepo = new InMemoryDataDeletionRequestRepository();
    const securityAlertRepo = new InMemorySecurityAlertRepository();
    const ipAccessLogRepo = new InMemoryIpAccessLogRepository();
    const compliancePolicyRepo = new InMemoryCompliancePolicyRepository();
    
    const recordAuditActionUseCase = new RecordAuditActionUseCase(auditRecordRepo, eventBus);
    const recordGdprConsentUseCase = new RecordGdprConsentUseCase(gdprConsentRecordRepo, eventBus);
    const requestDataExportUseCase = new RequestDataExportUseCase(dataExportRequestRepo, eventBus);
    const processDataDeletionUseCase = new ProcessDataDeletionUseCase(dataDeletionRequestRepo, eventBus);
    const logSecurityEventUseCase = new LogSecurityEventUseCase(securityAlertRepo, eventBus);
    const getAuditTrailByEntityUseCase = new GetAuditTrailByEntityUseCase(ipAccessLogRepo, eventBus);
    const generateComplianceReportUseCase = new GenerateComplianceReportUseCase(compliancePolicyRepo, eventBus);

    this.context = {
      auditRecordRepo,
      gdprConsentRecordRepo,
      dataExportRequestRepo,
      dataDeletionRequestRepo,
      securityAlertRepo,
      ipAccessLogRepo,
      compliancePolicyRepo,
      recordAuditActionUseCase,
      recordGdprConsentUseCase,
      requestDataExportUseCase,
      processDataDeletionUseCase,
      logSecurityEventUseCase,
      getAuditTrailByEntityUseCase,
      generateComplianceReportUseCase,
    };
  }

  public getContext(): AuditComplianceModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/audit-compliance";

    
    router.register("GET", `${basePath}/auditrecords`, async (req, res) => {
      const items = await this.context.auditRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/auditrecords/:id`, async (req, res, params) => {
      const item = await this.context.auditRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "AuditRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/gdprconsentrecords`, async (req, res) => {
      const items = await this.context.gdprConsentRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/gdprconsentrecords/:id`, async (req, res, params) => {
      const item = await this.context.gdprConsentRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "GdprConsentRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/dataexportrequests`, async (req, res) => {
      const items = await this.context.dataExportRequestRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/dataexportrequests/:id`, async (req, res, params) => {
      const item = await this.context.dataExportRequestRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "DataExportRequest not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/datadeletionrequests`, async (req, res) => {
      const items = await this.context.dataDeletionRequestRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/datadeletionrequests/:id`, async (req, res, params) => {
      const item = await this.context.dataDeletionRequestRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "DataDeletionRequest not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/securityalerts`, async (req, res) => {
      const items = await this.context.securityAlertRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/securityalerts/:id`, async (req, res, params) => {
      const item = await this.context.securityAlertRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SecurityAlert not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ipaccesslogs`, async (req, res) => {
      const items = await this.context.ipAccessLogRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ipaccesslogs/:id`, async (req, res, params) => {
      const item = await this.context.ipAccessLogRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "IpAccessLog not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/compliancepolicys`, async (req, res) => {
      const items = await this.context.compliancePolicyRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/compliancepolicys/:id`, async (req, res, params) => {
      const item = await this.context.compliancePolicyRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CompliancePolicy not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/recordauditaction`, async (req, res, params, body) => {
      const result = await this.context.recordAuditActionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/recordgdprconsent`, async (req, res, params, body) => {
      const result = await this.context.recordGdprConsentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/requestdataexport`, async (req, res, params, body) => {
      const result = await this.context.requestDataExportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/processdatadeletion`, async (req, res, params, body) => {
      const result = await this.context.processDataDeletionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/logsecurityevent`, async (req, res, params, body) => {
      const result = await this.context.logSecurityEventUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getaudittrailbyentity`, async (req, res, params, body) => {
      const result = await this.context.getAuditTrailByEntityUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generatecompliancereport`, async (req, res, params, body) => {
      const result = await this.context.generateComplianceReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
