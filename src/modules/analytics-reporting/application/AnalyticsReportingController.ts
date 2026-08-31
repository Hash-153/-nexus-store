import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryDailySalesSnapshotRepository } from "../infrastructure/InMemoryDailySalesSnapshotRepository.ts";
import { InMemoryProductPerformanceRecordRepository } from "../infrastructure/InMemoryProductPerformanceRecordRepository.ts";
import { InMemoryCustomerCohortRepository } from "../infrastructure/InMemoryCustomerCohortRepository.ts";
import { InMemoryFunnelStageMetricRepository } from "../infrastructure/InMemoryFunnelStageMetricRepository.ts";
import { InMemoryInventoryTurnoverRecordRepository } from "../infrastructure/InMemoryInventoryTurnoverRecordRepository.ts";
import { InMemoryProfitMarginMetricRepository } from "../infrastructure/InMemoryProfitMarginMetricRepository.ts";
import { InMemoryRefundRateMetricRepository } from "../infrastructure/InMemoryRefundRateMetricRepository.ts";
import { InMemoryTrafficSourceMetricRepository } from "../infrastructure/InMemoryTrafficSourceMetricRepository.ts";
import { GenerateDailySalesReportUseCase } from "./GenerateDailySalesReportUseCase.ts";
import { GenerateProductPerformanceReportUseCase } from "./GenerateProductPerformanceReportUseCase.ts";
import { GenerateCohortAnalysisUseCase } from "./GenerateCohortAnalysisUseCase.ts";
import { GenerateConversionFunnelReportUseCase } from "./GenerateConversionFunnelReportUseCase.ts";
import { CalculateCustomerLifetimeValueUseCase } from "./CalculateCustomerLifetimeValueUseCase.ts";
import { AnalyzeInventoryTurnoverUseCase } from "./AnalyzeInventoryTurnoverUseCase.ts";
import { GetFinancialSummaryReportUseCase } from "./GetFinancialSummaryReportUseCase.ts";
import { ExportAnalyticsToCsvUseCase } from "./ExportAnalyticsToCsvUseCase.ts";

export interface AnalyticsReportingModuleContext {
  dailySalesSnapshotRepo: InMemoryDailySalesSnapshotRepository;
  productPerformanceRecordRepo: InMemoryProductPerformanceRecordRepository;
  customerCohortRepo: InMemoryCustomerCohortRepository;
  funnelStageMetricRepo: InMemoryFunnelStageMetricRepository;
  inventoryTurnoverRecordRepo: InMemoryInventoryTurnoverRecordRepository;
  profitMarginMetricRepo: InMemoryProfitMarginMetricRepository;
  refundRateMetricRepo: InMemoryRefundRateMetricRepository;
  trafficSourceMetricRepo: InMemoryTrafficSourceMetricRepository;
  generateDailySalesReportUseCase: GenerateDailySalesReportUseCase;
  generateProductPerformanceReportUseCase: GenerateProductPerformanceReportUseCase;
  generateCohortAnalysisUseCase: GenerateCohortAnalysisUseCase;
  generateConversionFunnelReportUseCase: GenerateConversionFunnelReportUseCase;
  calculateCustomerLifetimeValueUseCase: CalculateCustomerLifetimeValueUseCase;
  analyzeInventoryTurnoverUseCase: AnalyzeInventoryTurnoverUseCase;
  getFinancialSummaryReportUseCase: GetFinancialSummaryReportUseCase;
  exportAnalyticsToCsvUseCase: ExportAnalyticsToCsvUseCase;
}

export class AnalyticsReportingController {
  private readonly context: AnalyticsReportingModuleContext;

  constructor(eventBus: IEventBus) {
    const dailySalesSnapshotRepo = new InMemoryDailySalesSnapshotRepository();
    const productPerformanceRecordRepo = new InMemoryProductPerformanceRecordRepository();
    const customerCohortRepo = new InMemoryCustomerCohortRepository();
    const funnelStageMetricRepo = new InMemoryFunnelStageMetricRepository();
    const inventoryTurnoverRecordRepo = new InMemoryInventoryTurnoverRecordRepository();
    const profitMarginMetricRepo = new InMemoryProfitMarginMetricRepository();
    const refundRateMetricRepo = new InMemoryRefundRateMetricRepository();
    const trafficSourceMetricRepo = new InMemoryTrafficSourceMetricRepository();
    
    const generateDailySalesReportUseCase = new GenerateDailySalesReportUseCase(dailySalesSnapshotRepo, eventBus);
    const generateProductPerformanceReportUseCase = new GenerateProductPerformanceReportUseCase(productPerformanceRecordRepo, eventBus);
    const generateCohortAnalysisUseCase = new GenerateCohortAnalysisUseCase(customerCohortRepo, eventBus);
    const generateConversionFunnelReportUseCase = new GenerateConversionFunnelReportUseCase(funnelStageMetricRepo, eventBus);
    const calculateCustomerLifetimeValueUseCase = new CalculateCustomerLifetimeValueUseCase(inventoryTurnoverRecordRepo, eventBus);
    const analyzeInventoryTurnoverUseCase = new AnalyzeInventoryTurnoverUseCase(profitMarginMetricRepo, eventBus);
    const getFinancialSummaryReportUseCase = new GetFinancialSummaryReportUseCase(refundRateMetricRepo, eventBus);
    const exportAnalyticsToCsvUseCase = new ExportAnalyticsToCsvUseCase(trafficSourceMetricRepo, eventBus);

    this.context = {
      dailySalesSnapshotRepo,
      productPerformanceRecordRepo,
      customerCohortRepo,
      funnelStageMetricRepo,
      inventoryTurnoverRecordRepo,
      profitMarginMetricRepo,
      refundRateMetricRepo,
      trafficSourceMetricRepo,
      generateDailySalesReportUseCase,
      generateProductPerformanceReportUseCase,
      generateCohortAnalysisUseCase,
      generateConversionFunnelReportUseCase,
      calculateCustomerLifetimeValueUseCase,
      analyzeInventoryTurnoverUseCase,
      getFinancialSummaryReportUseCase,
      exportAnalyticsToCsvUseCase,
    };
  }

  public getContext(): AnalyticsReportingModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/analytics-reporting";

    
    router.register("GET", `${basePath}/dailysalessnapshots`, async (req, res) => {
      const items = await this.context.dailySalesSnapshotRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/dailysalessnapshots/:id`, async (req, res, params) => {
      const item = await this.context.dailySalesSnapshotRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "DailySalesSnapshot not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productperformancerecords`, async (req, res) => {
      const items = await this.context.productPerformanceRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productperformancerecords/:id`, async (req, res, params) => {
      const item = await this.context.productPerformanceRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductPerformanceRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/customercohorts`, async (req, res) => {
      const items = await this.context.customerCohortRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/customercohorts/:id`, async (req, res, params) => {
      const item = await this.context.customerCohortRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CustomerCohort not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/funnelstagemetrics`, async (req, res) => {
      const items = await this.context.funnelStageMetricRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/funnelstagemetrics/:id`, async (req, res, params) => {
      const item = await this.context.funnelStageMetricRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "FunnelStageMetric not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/inventoryturnoverrecords`, async (req, res) => {
      const items = await this.context.inventoryTurnoverRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/inventoryturnoverrecords/:id`, async (req, res, params) => {
      const item = await this.context.inventoryTurnoverRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "InventoryTurnoverRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/profitmarginmetrics`, async (req, res) => {
      const items = await this.context.profitMarginMetricRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/profitmarginmetrics/:id`, async (req, res, params) => {
      const item = await this.context.profitMarginMetricRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProfitMarginMetric not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/refundratemetrics`, async (req, res) => {
      const items = await this.context.refundRateMetricRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/refundratemetrics/:id`, async (req, res, params) => {
      const item = await this.context.refundRateMetricRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RefundRateMetric not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/trafficsourcemetrics`, async (req, res) => {
      const items = await this.context.trafficSourceMetricRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/trafficsourcemetrics/:id`, async (req, res, params) => {
      const item = await this.context.trafficSourceMetricRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TrafficSourceMetric not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/generatedailysalesreport`, async (req, res, params, body) => {
      const result = await this.context.generateDailySalesReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generateproductperformancereport`, async (req, res, params, body) => {
      const result = await this.context.generateProductPerformanceReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generatecohortanalysis`, async (req, res, params, body) => {
      const result = await this.context.generateCohortAnalysisUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generateconversionfunnelreport`, async (req, res, params, body) => {
      const result = await this.context.generateConversionFunnelReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/calculatecustomerlifetimevalue`, async (req, res, params, body) => {
      const result = await this.context.calculateCustomerLifetimeValueUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/analyzeinventoryturnover`, async (req, res, params, body) => {
      const result = await this.context.analyzeInventoryTurnoverUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getfinancialsummaryreport`, async (req, res, params, body) => {
      const result = await this.context.getFinancialSummaryReportUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/exportanalyticstocsv`, async (req, res, params, body) => {
      const result = await this.context.exportAnalyticsToCsvUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
