import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryNotificationTemplateRepository } from "../infrastructure/InMemoryNotificationTemplateRepository.ts";
import { InMemoryNotificationLogRepository } from "../infrastructure/InMemoryNotificationLogRepository.ts";
import { InMemoryUserPreferenceRepository } from "../infrastructure/InMemoryUserPreferenceRepository.ts";
import { InMemoryEmailMessageRepository } from "../infrastructure/InMemoryEmailMessageRepository.ts";
import { InMemorySmsMessageRepository } from "../infrastructure/InMemorySmsMessageRepository.ts";
import { InMemoryPushNotificationRepository } from "../infrastructure/InMemoryPushNotificationRepository.ts";
import { InMemoryWebhookNotificationRepository } from "../infrastructure/InMemoryWebhookNotificationRepository.ts";
import { SendNotificationUseCase } from "./SendNotificationUseCase.ts";
import { SendOrderConfirmationEmailUseCase } from "./SendOrderConfirmationEmailUseCase.ts";
import { SendShippingUpdateSmsUseCase } from "./SendShippingUpdateSmsUseCase.ts";
import { SendPushNotificationUseCase } from "./SendPushNotificationUseCase.ts";
import { ManageNotificationPreferencesUseCase } from "./ManageNotificationPreferencesUseCase.ts";
import { CreateNotificationTemplateUseCase } from "./CreateNotificationTemplateUseCase.ts";
import { GetNotificationHistoryUseCase } from "./GetNotificationHistoryUseCase.ts";

export interface NotificationsModuleContext {
  notificationTemplateRepo: InMemoryNotificationTemplateRepository;
  notificationLogRepo: InMemoryNotificationLogRepository;
  userPreferenceRepo: InMemoryUserPreferenceRepository;
  emailMessageRepo: InMemoryEmailMessageRepository;
  smsMessageRepo: InMemorySmsMessageRepository;
  pushNotificationRepo: InMemoryPushNotificationRepository;
  webhookNotificationRepo: InMemoryWebhookNotificationRepository;
  sendNotificationUseCase: SendNotificationUseCase;
  sendOrderConfirmationEmailUseCase: SendOrderConfirmationEmailUseCase;
  sendShippingUpdateSmsUseCase: SendShippingUpdateSmsUseCase;
  sendPushNotificationUseCase: SendPushNotificationUseCase;
  manageNotificationPreferencesUseCase: ManageNotificationPreferencesUseCase;
  createNotificationTemplateUseCase: CreateNotificationTemplateUseCase;
  getNotificationHistoryUseCase: GetNotificationHistoryUseCase;
}

export class NotificationsController {
  private readonly context: NotificationsModuleContext;

  constructor(eventBus: IEventBus) {
    const notificationTemplateRepo = new InMemoryNotificationTemplateRepository();
    const notificationLogRepo = new InMemoryNotificationLogRepository();
    const userPreferenceRepo = new InMemoryUserPreferenceRepository();
    const emailMessageRepo = new InMemoryEmailMessageRepository();
    const smsMessageRepo = new InMemorySmsMessageRepository();
    const pushNotificationRepo = new InMemoryPushNotificationRepository();
    const webhookNotificationRepo = new InMemoryWebhookNotificationRepository();
    
    const sendNotificationUseCase = new SendNotificationUseCase(notificationTemplateRepo, eventBus);
    const sendOrderConfirmationEmailUseCase = new SendOrderConfirmationEmailUseCase(notificationLogRepo, eventBus);
    const sendShippingUpdateSmsUseCase = new SendShippingUpdateSmsUseCase(userPreferenceRepo, eventBus);
    const sendPushNotificationUseCase = new SendPushNotificationUseCase(emailMessageRepo, eventBus);
    const manageNotificationPreferencesUseCase = new ManageNotificationPreferencesUseCase(smsMessageRepo, eventBus);
    const createNotificationTemplateUseCase = new CreateNotificationTemplateUseCase(pushNotificationRepo, eventBus);
    const getNotificationHistoryUseCase = new GetNotificationHistoryUseCase(webhookNotificationRepo, eventBus);

    this.context = {
      notificationTemplateRepo,
      notificationLogRepo,
      userPreferenceRepo,
      emailMessageRepo,
      smsMessageRepo,
      pushNotificationRepo,
      webhookNotificationRepo,
      sendNotificationUseCase,
      sendOrderConfirmationEmailUseCase,
      sendShippingUpdateSmsUseCase,
      sendPushNotificationUseCase,
      manageNotificationPreferencesUseCase,
      createNotificationTemplateUseCase,
      getNotificationHistoryUseCase,
    };
  }

  public getContext(): NotificationsModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/notifications";

    
    router.register("GET", `${basePath}/notificationtemplates`, async (req, res) => {
      const items = await this.context.notificationTemplateRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/notificationtemplates/:id`, async (req, res, params) => {
      const item = await this.context.notificationTemplateRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "NotificationTemplate not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/notificationlogs`, async (req, res) => {
      const items = await this.context.notificationLogRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/notificationlogs/:id`, async (req, res, params) => {
      const item = await this.context.notificationLogRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "NotificationLog not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/userpreferences`, async (req, res) => {
      const items = await this.context.userPreferenceRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/userpreferences/:id`, async (req, res, params) => {
      const item = await this.context.userPreferenceRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "UserPreference not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/emailmessages`, async (req, res) => {
      const items = await this.context.emailMessageRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/emailmessages/:id`, async (req, res, params) => {
      const item = await this.context.emailMessageRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "EmailMessage not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/smsmessages`, async (req, res) => {
      const items = await this.context.smsMessageRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/smsmessages/:id`, async (req, res, params) => {
      const item = await this.context.smsMessageRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SmsMessage not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pushnotifications`, async (req, res) => {
      const items = await this.context.pushNotificationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pushnotifications/:id`, async (req, res, params) => {
      const item = await this.context.pushNotificationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PushNotification not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/webhooknotifications`, async (req, res) => {
      const items = await this.context.webhookNotificationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/webhooknotifications/:id`, async (req, res, params) => {
      const item = await this.context.webhookNotificationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "WebhookNotification not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/sendnotification`, async (req, res, params, body) => {
      const result = await this.context.sendNotificationUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/sendorderconfirmationemail`, async (req, res, params, body) => {
      const result = await this.context.sendOrderConfirmationEmailUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/sendshippingupdatesms`, async (req, res, params, body) => {
      const result = await this.context.sendShippingUpdateSmsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/sendpushnotification`, async (req, res, params, body) => {
      const result = await this.context.sendPushNotificationUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/managenotificationpreferences`, async (req, res, params, body) => {
      const result = await this.context.manageNotificationPreferencesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createnotificationtemplate`, async (req, res, params, body) => {
      const result = await this.context.createNotificationTemplateUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getnotificationhistory`, async (req, res, params, body) => {
      const result = await this.context.getNotificationHistoryUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
