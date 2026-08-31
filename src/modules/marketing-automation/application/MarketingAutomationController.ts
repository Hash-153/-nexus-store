import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryCampaignRepository } from "../infrastructure/InMemoryCampaignRepository.ts";
import { InMemoryEmailSubscriberRepository } from "../infrastructure/InMemoryEmailSubscriberRepository.ts";
import { InMemoryAbandonedCartRecordRepository } from "../infrastructure/InMemoryAbandonedCartRecordRepository.ts";
import { InMemoryPriceDropSubscriptionRepository } from "../infrastructure/InMemoryPriceDropSubscriptionRepository.ts";
import { InMemoryBackInStockSubscriptionRepository } from "../infrastructure/InMemoryBackInStockSubscriptionRepository.ts";
import { InMemoryPersonalizedRecommendationRepository } from "../infrastructure/InMemoryPersonalizedRecommendationRepository.ts";
import { InMemorySegmentRuleRepository } from "../infrastructure/InMemorySegmentRuleRepository.ts";
import { CreateCampaignUseCase } from "./CreateCampaignUseCase.ts";
import { SubscribeToNewsletterUseCase } from "./SubscribeToNewsletterUseCase.ts";
import { UnsubscribeFromNewsletterUseCase } from "./UnsubscribeFromNewsletterUseCase.ts";
import { TrackAbandonedCartUseCase } from "./TrackAbandonedCartUseCase.ts";
import { SendAbandonedCartNotificationUseCase } from "./SendAbandonedCartNotificationUseCase.ts";
import { SubscribeToPriceDropUseCase } from "./SubscribeToPriceDropUseCase.ts";
import { SubscribeToBackInStockUseCase } from "./SubscribeToBackInStockUseCase.ts";
import { GenerateProductRecommendationsUseCase } from "./GenerateProductRecommendationsUseCase.ts";
import { SegmentCustomersUseCase } from "./SegmentCustomersUseCase.ts";

export interface MarketingAutomationModuleContext {
  campaignRepo: InMemoryCampaignRepository;
  emailSubscriberRepo: InMemoryEmailSubscriberRepository;
  abandonedCartRecordRepo: InMemoryAbandonedCartRecordRepository;
  priceDropSubscriptionRepo: InMemoryPriceDropSubscriptionRepository;
  backInStockSubscriptionRepo: InMemoryBackInStockSubscriptionRepository;
  personalizedRecommendationRepo: InMemoryPersonalizedRecommendationRepository;
  segmentRuleRepo: InMemorySegmentRuleRepository;
  createCampaignUseCase: CreateCampaignUseCase;
  subscribeToNewsletterUseCase: SubscribeToNewsletterUseCase;
  unsubscribeFromNewsletterUseCase: UnsubscribeFromNewsletterUseCase;
  trackAbandonedCartUseCase: TrackAbandonedCartUseCase;
  sendAbandonedCartNotificationUseCase: SendAbandonedCartNotificationUseCase;
  subscribeToPriceDropUseCase: SubscribeToPriceDropUseCase;
  subscribeToBackInStockUseCase: SubscribeToBackInStockUseCase;
  generateProductRecommendationsUseCase: GenerateProductRecommendationsUseCase;
  segmentCustomersUseCase: SegmentCustomersUseCase;
}

export class MarketingAutomationController {
  private readonly context: MarketingAutomationModuleContext;

  constructor(eventBus: IEventBus) {
    const campaignRepo = new InMemoryCampaignRepository();
    const emailSubscriberRepo = new InMemoryEmailSubscriberRepository();
    const abandonedCartRecordRepo = new InMemoryAbandonedCartRecordRepository();
    const priceDropSubscriptionRepo = new InMemoryPriceDropSubscriptionRepository();
    const backInStockSubscriptionRepo = new InMemoryBackInStockSubscriptionRepository();
    const personalizedRecommendationRepo = new InMemoryPersonalizedRecommendationRepository();
    const segmentRuleRepo = new InMemorySegmentRuleRepository();
    
    const createCampaignUseCase = new CreateCampaignUseCase(campaignRepo, eventBus);
    const subscribeToNewsletterUseCase = new SubscribeToNewsletterUseCase(emailSubscriberRepo, eventBus);
    const unsubscribeFromNewsletterUseCase = new UnsubscribeFromNewsletterUseCase(abandonedCartRecordRepo, eventBus);
    const trackAbandonedCartUseCase = new TrackAbandonedCartUseCase(priceDropSubscriptionRepo, eventBus);
    const sendAbandonedCartNotificationUseCase = new SendAbandonedCartNotificationUseCase(backInStockSubscriptionRepo, eventBus);
    const subscribeToPriceDropUseCase = new SubscribeToPriceDropUseCase(personalizedRecommendationRepo, eventBus);
    const subscribeToBackInStockUseCase = new SubscribeToBackInStockUseCase(segmentRuleRepo, eventBus);
    const generateProductRecommendationsUseCase = new GenerateProductRecommendationsUseCase(campaignRepo, eventBus);
    const segmentCustomersUseCase = new SegmentCustomersUseCase(emailSubscriberRepo, eventBus);

    this.context = {
      campaignRepo,
      emailSubscriberRepo,
      abandonedCartRecordRepo,
      priceDropSubscriptionRepo,
      backInStockSubscriptionRepo,
      personalizedRecommendationRepo,
      segmentRuleRepo,
      createCampaignUseCase,
      subscribeToNewsletterUseCase,
      unsubscribeFromNewsletterUseCase,
      trackAbandonedCartUseCase,
      sendAbandonedCartNotificationUseCase,
      subscribeToPriceDropUseCase,
      subscribeToBackInStockUseCase,
      generateProductRecommendationsUseCase,
      segmentCustomersUseCase,
    };
  }

  public getContext(): MarketingAutomationModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/marketing-automation";

    
    router.register("GET", `${basePath}/campaigns`, async (req, res) => {
      const items = await this.context.campaignRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/campaigns/:id`, async (req, res, params) => {
      const item = await this.context.campaignRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/emailsubscribers`, async (req, res) => {
      const items = await this.context.emailSubscriberRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/emailsubscribers/:id`, async (req, res, params) => {
      const item = await this.context.emailSubscriberRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "EmailSubscriber not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/abandonedcartrecords`, async (req, res) => {
      const items = await this.context.abandonedCartRecordRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/abandonedcartrecords/:id`, async (req, res, params) => {
      const item = await this.context.abandonedCartRecordRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "AbandonedCartRecord not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pricedropsubscriptions`, async (req, res) => {
      const items = await this.context.priceDropSubscriptionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pricedropsubscriptions/:id`, async (req, res, params) => {
      const item = await this.context.priceDropSubscriptionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PriceDropSubscription not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/backinstocksubscriptions`, async (req, res) => {
      const items = await this.context.backInStockSubscriptionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/backinstocksubscriptions/:id`, async (req, res, params) => {
      const item = await this.context.backInStockSubscriptionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BackInStockSubscription not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/personalizedrecommendations`, async (req, res) => {
      const items = await this.context.personalizedRecommendationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/personalizedrecommendations/:id`, async (req, res, params) => {
      const item = await this.context.personalizedRecommendationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PersonalizedRecommendation not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/segmentrules`, async (req, res) => {
      const items = await this.context.segmentRuleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/segmentrules/:id`, async (req, res, params) => {
      const item = await this.context.segmentRuleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SegmentRule not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createcampaign`, async (req, res, params, body) => {
      const result = await this.context.createCampaignUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/subscribetonewsletter`, async (req, res, params, body) => {
      const result = await this.context.subscribeToNewsletterUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/unsubscribefromnewsletter`, async (req, res, params, body) => {
      const result = await this.context.unsubscribeFromNewsletterUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/trackabandonedcart`, async (req, res, params, body) => {
      const result = await this.context.trackAbandonedCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/sendabandonedcartnotification`, async (req, res, params, body) => {
      const result = await this.context.sendAbandonedCartNotificationUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/subscribetopricedrop`, async (req, res, params, body) => {
      const result = await this.context.subscribeToPriceDropUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/subscribetobackinstock`, async (req, res, params, body) => {
      const result = await this.context.subscribeToBackInStockUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generateproductrecommendations`, async (req, res, params, body) => {
      const result = await this.context.generateProductRecommendationsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/segmentcustomers`, async (req, res, params, body) => {
      const result = await this.context.segmentCustomersUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
