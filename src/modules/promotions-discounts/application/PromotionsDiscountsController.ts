import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryCouponRepository } from "../infrastructure/InMemoryCouponRepository.ts";
import { InMemoryPromotionRuleRepository } from "../infrastructure/InMemoryPromotionRuleRepository.ts";
import { InMemoryTieredDiscountRuleRepository } from "../infrastructure/InMemoryTieredDiscountRuleRepository.ts";
import { InMemoryBogoRuleRepository } from "../infrastructure/InMemoryBogoRuleRepository.ts";
import { InMemoryBundleDiscountRepository } from "../infrastructure/InMemoryBundleDiscountRepository.ts";
import { InMemoryCustomerGroupDiscountRepository } from "../infrastructure/InMemoryCustomerGroupDiscountRepository.ts";
import { InMemoryFlashSaleRepository } from "../infrastructure/InMemoryFlashSaleRepository.ts";
import { InMemoryCouponUsageRecordRepository } from "../infrastructure/InMemoryCouponUsageRecordRepository.ts";
import { CreateCouponUseCase } from "./CreateCouponUseCase.ts";
import { UpdateCouponUseCase } from "./UpdateCouponUseCase.ts";
import { DeactivateCouponUseCase } from "./DeactivateCouponUseCase.ts";
import { ValidateCouponUseCase } from "./ValidateCouponUseCase.ts";
import { ApplyPromotionRuleUseCase } from "./ApplyPromotionRuleUseCase.ts";
import { CreateFlashSaleUseCase } from "./CreateFlashSaleUseCase.ts";
import { CreateBogoPromotionUseCase } from "./CreateBogoPromotionUseCase.ts";
import { EvaluateCartDiscountsUseCase } from "./EvaluateCartDiscountsUseCase.ts";
import { GetActivePromotionsUseCase } from "./GetActivePromotionsUseCase.ts";
import { TrackCouponUsageUseCase } from "./TrackCouponUsageUseCase.ts";

export interface PromotionsDiscountsModuleContext {
  couponRepo: InMemoryCouponRepository;
  promotionRuleRepo: InMemoryPromotionRuleRepository;
  tieredDiscountRuleRepo: InMemoryTieredDiscountRuleRepository;
  bogoRuleRepo: InMemoryBogoRuleRepository;
  bundleDiscountRepo: InMemoryBundleDiscountRepository;
  customerGroupDiscountRepo: InMemoryCustomerGroupDiscountRepository;
  flashSaleRepo: InMemoryFlashSaleRepository;
  couponUsageRecordRepo: InMemoryCouponUsageRecordRepository;
  createCouponUseCase: CreateCouponUseCase;
  updateCouponUseCase: UpdateCouponUseCase;
  deactivateCouponUseCase: DeactivateCouponUseCase;
  validateCouponUseCase: ValidateCouponUseCase;
  applyPromotionRuleUseCase: ApplyPromotionRuleUseCase;
  createFlashSaleUseCase: CreateFlashSaleUseCase;
  createBogoPromotionUseCase: CreateBogoPromotionUseCase;
  evaluateCartDiscountsUseCase: EvaluateCartDiscountsUseCase;
  getActivePromotionsUseCase: GetActivePromotionsUseCase;
  trackCouponUsageUseCase: TrackCouponUsageUseCase;
}

export class PromotionsDiscountsController {
  private readonly context: PromotionsDiscountsModuleContext;

  constructor(eventBus: IEventBus) {
    const couponRepo = new InMemoryCouponRepository();
    const promotionRuleRepo = new InMemoryPromotionRuleRepository();
    const tieredDiscountRuleRepo = new InMemoryTieredDiscountRuleRepository();
    const bogoRuleRepo = new InMemoryBogoRuleRepository();
    const bundleDiscountRepo = new InMemoryBundleDiscountRepository();
    const customerGroupDiscountRepo = new InMemoryCustomerGroupDiscountRepository();
    const flashSaleRepo = new InMemoryFlashSaleRepository();
    const couponUsageRecordRepo = new InMemoryCouponUsageRecordRepository();
    
    const createCouponUseCase = new CreateCouponUseCase(couponRepo, eventBus);
    const updateCouponUseCase = new UpdateCouponUseCase(promotionRuleRepo, eventBus);
    const deactivateCouponUseCase = new DeactivateCouponUseCase(tieredDiscountRuleRepo, eventBus);
    const validateCouponUseCase = new ValidateCouponUseCase(bogoRuleRepo, eventBus);
    const applyPromotionRuleUseCase = new ApplyPromotionRuleUseCase(bundleDiscountRepo, eventBus);
    const createFlashSaleUseCase = new CreateFlashSaleUseCase(customerGroupDiscountRepo, eventBus);
    const createBogoPromotionUseCase = new CreateBogoPromotionUseCase(flashSaleRepo, eventBus);
    const evaluateCartDiscountsUseCase = new EvaluateCartDiscountsUseCase(couponUsageRecordRepo, eventBus);
    const getActivePromotionsUseCase = new GetActivePromotionsUseCase(couponRepo, eventBus);
    const trackCouponUsageUseCase = new TrackCouponUsageUseCase(promotionRuleRepo, eventBus);

    this.context = {
      couponRepo,
      promotionRuleRepo,
      tieredDiscountRuleRepo,
      bogoRuleRepo,
      bundleDiscountRepo,
      customerGroupDiscountRepo,
      flashSaleRepo,
      couponUsageRecordRepo,
      createCouponUseCase,
      updateCouponUseCase,
      deactivateCouponUseCase,
      validateCouponUseCase,
      applyPromotionRuleUseCase,
      createFlashSaleUseCase,
      createBogoPromotionUseCase,
      evaluateCartDiscountsUseCase,
      getActivePromotionsUseCase,
      trackCouponUsageUseCase,
    };
  }

  public getContext(): PromotionsDiscountsModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/promotions-discounts";

    
    router.register("GET", `${basePath}/coupons`, async (req, res) => {
      const items = await this.context.couponRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/coupons/:id`, async (req, res, params) => {
      const item = await this.context.couponRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Coupon not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/promotionrules`, async (req, res) => {
      const items = await this.context.promotionRuleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/promotionrules/:id`, async (req, res, params) => {
      const item = await this.context.promotionRuleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PromotionRule not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/tiereddiscountrules`, async (req, res) => {
      const items = await this.context.tieredDiscountRuleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/tiereddiscountrules/:id`, async (req, res, params) => {
      const item = await this.context.tieredDiscountRuleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TieredDiscountRule not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/bogorules`, async (req, res) => {
      const items = await this.context.bogoRuleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/bogorules/:id`, async (req, res, params) => {
      const item = await this.context.bogoRuleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BogoRule not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/bundlediscounts`, async (req, res) => {
      const items = await this.context.bundleDiscountRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/bundlediscounts/:id`, async (req, res, params) => {
      const item = await this.context.bundleDiscountRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BundleDiscount not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/customergroupdiscounts`, async (req, res) => {
      const items = await this.context.customerGroupDiscountRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/customergroupdiscounts/:id`, async (req, res, params) => {
      const item = await this.context.customerGroupDiscountRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CustomerGroupDiscount not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/flashsales`, async (req, res) => {
      const items = await this.context.flashSaleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/flashsales/:id`, async (req, res, params) => {
      const item = await this.context.flashSaleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "FlashSale not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/couponusagerecords`, async (req, res) => {
      const items = await this.context.couponUsageRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/couponusagerecords/:id`, async (req, res, params) => {
      const item = await this.context.couponUsageRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CouponUsageRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createcoupon`, async (req, res, params, body) => {
      const result = await this.context.createCouponUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatecoupon`, async (req, res, params, body) => {
      const result = await this.context.updateCouponUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/deactivatecoupon`, async (req, res, params, body) => {
      const result = await this.context.deactivateCouponUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/validatecoupon`, async (req, res, params, body) => {
      const result = await this.context.validateCouponUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/applypromotionrule`, async (req, res, params, body) => {
      const result = await this.context.applyPromotionRuleUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createflashsale`, async (req, res, params, body) => {
      const result = await this.context.createFlashSaleUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createbogopromotion`, async (req, res, params, body) => {
      const result = await this.context.createBogoPromotionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/evaluatecartdiscounts`, async (req, res, params, body) => {
      const result = await this.context.evaluateCartDiscountsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getactivepromotions`, async (req, res, params, body) => {
      const result = await this.context.getActivePromotionsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/trackcouponusage`, async (req, res, params, body) => {
      const result = await this.context.trackCouponUsageUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
