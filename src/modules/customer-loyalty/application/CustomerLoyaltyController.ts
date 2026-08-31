import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryLoyaltyAccountRepository } from "../infrastructure/InMemoryLoyaltyAccountRepository.ts";
import { InMemoryPointsLedgerEntryRepository } from "../infrastructure/InMemoryPointsLedgerEntryRepository.ts";
import { InMemoryLoyaltyTierRepository } from "../infrastructure/InMemoryLoyaltyTierRepository.ts";
import { InMemoryRewardVoucherRepository } from "../infrastructure/InMemoryRewardVoucherRepository.ts";
import { InMemoryReferralRecordRepository } from "../infrastructure/InMemoryReferralRecordRepository.ts";
import { InMemoryMilestoneRewardRepository } from "../infrastructure/InMemoryMilestoneRewardRepository.ts";
import { InMemoryPointsExpirationPolicyRepository } from "../infrastructure/InMemoryPointsExpirationPolicyRepository.ts";
import { EnrollCustomerInLoyaltyUseCase } from "./EnrollCustomerInLoyaltyUseCase.ts";
import { AwardPointsForPurchaseUseCase } from "./AwardPointsForPurchaseUseCase.ts";
import { RedeemPointsForVoucherUseCase } from "./RedeemPointsForVoucherUseCase.ts";
import { ProcessReferralRewardUseCase } from "./ProcessReferralRewardUseCase.ts";
import { UpgradeLoyaltyTierUseCase } from "./UpgradeLoyaltyTierUseCase.ts";
import { GetLoyaltyStatementUseCase } from "./GetLoyaltyStatementUseCase.ts";
import { ExpireInactivePointsUseCase } from "./ExpireInactivePointsUseCase.ts";
import { ConfigureTierBenefitsUseCase } from "./ConfigureTierBenefitsUseCase.ts";

export interface CustomerLoyaltyModuleContext {
  loyaltyAccountRepo: InMemoryLoyaltyAccountRepository;
  pointsLedgerEntryRepo: InMemoryPointsLedgerEntryRepository;
  loyaltyTierRepo: InMemoryLoyaltyTierRepository;
  rewardVoucherRepo: InMemoryRewardVoucherRepository;
  referralRecordRepo: InMemoryReferralRecordRepository;
  milestoneRewardRepo: InMemoryMilestoneRewardRepository;
  pointsExpirationPolicyRepo: InMemoryPointsExpirationPolicyRepository;
  enrollCustomerInLoyaltyUseCase: EnrollCustomerInLoyaltyUseCase;
  awardPointsForPurchaseUseCase: AwardPointsForPurchaseUseCase;
  redeemPointsForVoucherUseCase: RedeemPointsForVoucherUseCase;
  processReferralRewardUseCase: ProcessReferralRewardUseCase;
  upgradeLoyaltyTierUseCase: UpgradeLoyaltyTierUseCase;
  getLoyaltyStatementUseCase: GetLoyaltyStatementUseCase;
  expireInactivePointsUseCase: ExpireInactivePointsUseCase;
  configureTierBenefitsUseCase: ConfigureTierBenefitsUseCase;
}

export class CustomerLoyaltyController {
  private readonly context: CustomerLoyaltyModuleContext;

  constructor(eventBus: IEventBus) {
    const loyaltyAccountRepo = new InMemoryLoyaltyAccountRepository();
    const pointsLedgerEntryRepo = new InMemoryPointsLedgerEntryRepository();
    const loyaltyTierRepo = new InMemoryLoyaltyTierRepository();
    const rewardVoucherRepo = new InMemoryRewardVoucherRepository();
    const referralRecordRepo = new InMemoryReferralRecordRepository();
    const milestoneRewardRepo = new InMemoryMilestoneRewardRepository();
    const pointsExpirationPolicyRepo = new InMemoryPointsExpirationPolicyRepository();
    
    const enrollCustomerInLoyaltyUseCase = new EnrollCustomerInLoyaltyUseCase(loyaltyAccountRepo, eventBus);
    const awardPointsForPurchaseUseCase = new AwardPointsForPurchaseUseCase(pointsLedgerEntryRepo, eventBus);
    const redeemPointsForVoucherUseCase = new RedeemPointsForVoucherUseCase(loyaltyTierRepo, eventBus);
    const processReferralRewardUseCase = new ProcessReferralRewardUseCase(rewardVoucherRepo, eventBus);
    const upgradeLoyaltyTierUseCase = new UpgradeLoyaltyTierUseCase(referralRecordRepo, eventBus);
    const getLoyaltyStatementUseCase = new GetLoyaltyStatementUseCase(milestoneRewardRepo, eventBus);
    const expireInactivePointsUseCase = new ExpireInactivePointsUseCase(pointsExpirationPolicyRepo, eventBus);
    const configureTierBenefitsUseCase = new ConfigureTierBenefitsUseCase(loyaltyAccountRepo, eventBus);

    this.context = {
      loyaltyAccountRepo,
      pointsLedgerEntryRepo,
      loyaltyTierRepo,
      rewardVoucherRepo,
      referralRecordRepo,
      milestoneRewardRepo,
      pointsExpirationPolicyRepo,
      enrollCustomerInLoyaltyUseCase,
      awardPointsForPurchaseUseCase,
      redeemPointsForVoucherUseCase,
      processReferralRewardUseCase,
      upgradeLoyaltyTierUseCase,
      getLoyaltyStatementUseCase,
      expireInactivePointsUseCase,
      configureTierBenefitsUseCase,
    };
  }

  public getContext(): CustomerLoyaltyModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/customer-loyalty";

    
    router.register("GET", `${basePath}/loyaltyaccounts`, async (req, res) => {
      const items = await this.context.loyaltyAccountRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/loyaltyaccounts/:id`, async (req, res, params) => {
      const item = await this.context.loyaltyAccountRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "LoyaltyAccount not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pointsledgerentrys`, async (req, res) => {
      const items = await this.context.pointsLedgerEntryRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pointsledgerentrys/:id`, async (req, res, params) => {
      const item = await this.context.pointsLedgerEntryRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PointsLedgerEntry not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/loyaltytiers`, async (req, res) => {
      const items = await this.context.loyaltyTierRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/loyaltytiers/:id`, async (req, res, params) => {
      const item = await this.context.loyaltyTierRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "LoyaltyTier not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/rewardvouchers`, async (req, res) => {
      const items = await this.context.rewardVoucherRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/rewardvouchers/:id`, async (req, res, params) => {
      const item = await this.context.rewardVoucherRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RewardVoucher not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/referralrecords`, async (req, res) => {
      const items = await this.context.referralRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/referralrecords/:id`, async (req, res, params) => {
      const item = await this.context.referralRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ReferralRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/milestonerewards`, async (req, res) => {
      const items = await this.context.milestoneRewardRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/milestonerewards/:id`, async (req, res, params) => {
      const item = await this.context.milestoneRewardRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "MilestoneReward not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pointsexpirationpolicys`, async (req, res) => {
      const items = await this.context.pointsExpirationPolicyRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pointsexpirationpolicys/:id`, async (req, res, params) => {
      const item = await this.context.pointsExpirationPolicyRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PointsExpirationPolicy not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/enrollcustomerinloyalty`, async (req, res, params, body) => {
      const result = await this.context.enrollCustomerInLoyaltyUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/awardpointsforpurchase`, async (req, res, params, body) => {
      const result = await this.context.awardPointsForPurchaseUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/redeempointsforvoucher`, async (req, res, params, body) => {
      const result = await this.context.redeemPointsForVoucherUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/processreferralreward`, async (req, res, params, body) => {
      const result = await this.context.processReferralRewardUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/upgradeloyaltytier`, async (req, res, params, body) => {
      const result = await this.context.upgradeLoyaltyTierUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getloyaltystatement`, async (req, res, params, body) => {
      const result = await this.context.getLoyaltyStatementUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/expireinactivepoints`, async (req, res, params, body) => {
      const result = await this.context.expireInactivePointsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/configuretierbenefits`, async (req, res, params, body) => {
      const result = await this.context.configureTierBenefitsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
