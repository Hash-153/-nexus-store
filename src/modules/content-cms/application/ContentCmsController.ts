import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryCmsPageRepository } from "../infrastructure/InMemoryCmsPageRepository.ts";
import { InMemoryBlogPostRepository } from "../infrastructure/InMemoryBlogPostRepository.ts";
import { InMemoryBannerSliderRepository } from "../infrastructure/InMemoryBannerSliderRepository.ts";
import { InMemoryFaqItemRepository } from "../infrastructure/InMemoryFaqItemRepository.ts";
import { InMemoryNavigationMenuRepository } from "../infrastructure/InMemoryNavigationMenuRepository.ts";
import { InMemoryMenuItemRepository } from "../infrastructure/InMemoryMenuItemRepository.ts";
import { InMemoryMediaAssetRepository } from "../infrastructure/InMemoryMediaAssetRepository.ts";
import { InMemorySeoMetadataRepository } from "../infrastructure/InMemorySeoMetadataRepository.ts";
import { CreateCmsPageUseCase } from "./CreateCmsPageUseCase.ts";
import { UpdateCmsPageUseCase } from "./UpdateCmsPageUseCase.ts";
import { PublishCmsPageUseCase } from "./PublishCmsPageUseCase.ts";
import { CreateBlogPostUseCase } from "./CreateBlogPostUseCase.ts";
import { PublishBlogPostUseCase } from "./PublishBlogPostUseCase.ts";
import { CreateBannerSliderUseCase } from "./CreateBannerSliderUseCase.ts";
import { ManageNavigationMenuUseCase } from "./ManageNavigationMenuUseCase.ts";
import { ManageFaqItemsUseCase } from "./ManageFaqItemsUseCase.ts";
import { UploadCmsMediaUseCase } from "./UploadCmsMediaUseCase.ts";
import { GetPublishedPageBySlugUseCase } from "./GetPublishedPageBySlugUseCase.ts";

export interface ContentCmsModuleContext {
  cmsPageRepo: InMemoryCmsPageRepository;
  blogPostRepo: InMemoryBlogPostRepository;
  bannerSliderRepo: InMemoryBannerSliderRepository;
  faqItemRepo: InMemoryFaqItemRepository;
  navigationMenuRepo: InMemoryNavigationMenuRepository;
  menuItemRepo: InMemoryMenuItemRepository;
  mediaAssetRepo: InMemoryMediaAssetRepository;
  seoMetadataRepo: InMemorySeoMetadataRepository;
  createCmsPageUseCase: CreateCmsPageUseCase;
  updateCmsPageUseCase: UpdateCmsPageUseCase;
  publishCmsPageUseCase: PublishCmsPageUseCase;
  createBlogPostUseCase: CreateBlogPostUseCase;
  publishBlogPostUseCase: PublishBlogPostUseCase;
  createBannerSliderUseCase: CreateBannerSliderUseCase;
  manageNavigationMenuUseCase: ManageNavigationMenuUseCase;
  manageFaqItemsUseCase: ManageFaqItemsUseCase;
  uploadCmsMediaUseCase: UploadCmsMediaUseCase;
  getPublishedPageBySlugUseCase: GetPublishedPageBySlugUseCase;
}

export class ContentCmsController {
  private readonly context: ContentCmsModuleContext;

  constructor(eventBus: IEventBus) {
    const cmsPageRepo = new InMemoryCmsPageRepository();
    const blogPostRepo = new InMemoryBlogPostRepository();
    const bannerSliderRepo = new InMemoryBannerSliderRepository();
    const faqItemRepo = new InMemoryFaqItemRepository();
    const navigationMenuRepo = new InMemoryNavigationMenuRepository();
    const menuItemRepo = new InMemoryMenuItemRepository();
    const mediaAssetRepo = new InMemoryMediaAssetRepository();
    const seoMetadataRepo = new InMemorySeoMetadataRepository();
    
    const createCmsPageUseCase = new CreateCmsPageUseCase(cmsPageRepo, eventBus);
    const updateCmsPageUseCase = new UpdateCmsPageUseCase(blogPostRepo, eventBus);
    const publishCmsPageUseCase = new PublishCmsPageUseCase(bannerSliderRepo, eventBus);
    const createBlogPostUseCase = new CreateBlogPostUseCase(faqItemRepo, eventBus);
    const publishBlogPostUseCase = new PublishBlogPostUseCase(navigationMenuRepo, eventBus);
    const createBannerSliderUseCase = new CreateBannerSliderUseCase(menuItemRepo, eventBus);
    const manageNavigationMenuUseCase = new ManageNavigationMenuUseCase(mediaAssetRepo, eventBus);
    const manageFaqItemsUseCase = new ManageFaqItemsUseCase(seoMetadataRepo, eventBus);
    const uploadCmsMediaUseCase = new UploadCmsMediaUseCase(cmsPageRepo, eventBus);
    const getPublishedPageBySlugUseCase = new GetPublishedPageBySlugUseCase(blogPostRepo, eventBus);

    this.context = {
      cmsPageRepo,
      blogPostRepo,
      bannerSliderRepo,
      faqItemRepo,
      navigationMenuRepo,
      menuItemRepo,
      mediaAssetRepo,
      seoMetadataRepo,
      createCmsPageUseCase,
      updateCmsPageUseCase,
      publishCmsPageUseCase,
      createBlogPostUseCase,
      publishBlogPostUseCase,
      createBannerSliderUseCase,
      manageNavigationMenuUseCase,
      manageFaqItemsUseCase,
      uploadCmsMediaUseCase,
      getPublishedPageBySlugUseCase,
    };
  }

  public getContext(): ContentCmsModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/content-cms";

    
    router.register("GET", `${basePath}/cmspages`, async (req, res) => {
      const items = await this.context.cmsPageRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/cmspages/:id`, async (req, res, params) => {
      const item = await this.context.cmsPageRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CmsPage not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/blogposts`, async (req, res) => {
      const items = await this.context.blogPostRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/blogposts/:id`, async (req, res, params) => {
      const item = await this.context.blogPostRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BlogPost not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/bannersliders`, async (req, res) => {
      const items = await this.context.bannerSliderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/bannersliders/:id`, async (req, res, params) => {
      const item = await this.context.bannerSliderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BannerSlider not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/faqitems`, async (req, res) => {
      const items = await this.context.faqItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/faqitems/:id`, async (req, res, params) => {
      const item = await this.context.faqItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "FaqItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/navigationmenus`, async (req, res) => {
      const items = await this.context.navigationMenuRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/navigationmenus/:id`, async (req, res, params) => {
      const item = await this.context.navigationMenuRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "NavigationMenu not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/menuitems`, async (req, res) => {
      const items = await this.context.menuItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/menuitems/:id`, async (req, res, params) => {
      const item = await this.context.menuItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "MenuItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/mediaassets`, async (req, res) => {
      const items = await this.context.mediaAssetRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/mediaassets/:id`, async (req, res, params) => {
      const item = await this.context.mediaAssetRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "MediaAsset not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/seometadatas`, async (req, res) => {
      const items = await this.context.seoMetadataRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/seometadatas/:id`, async (req, res, params) => {
      const item = await this.context.seoMetadataRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SeoMetadata not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createcmspage`, async (req, res, params, body) => {
      const result = await this.context.createCmsPageUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatecmspage`, async (req, res, params, body) => {
      const result = await this.context.updateCmsPageUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/publishcmspage`, async (req, res, params, body) => {
      const result = await this.context.publishCmsPageUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createblogpost`, async (req, res, params, body) => {
      const result = await this.context.createBlogPostUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/publishblogpost`, async (req, res, params, body) => {
      const result = await this.context.publishBlogPostUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createbannerslider`, async (req, res, params, body) => {
      const result = await this.context.createBannerSliderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/managenavigationmenu`, async (req, res, params, body) => {
      const result = await this.context.manageNavigationMenuUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/managefaqitems`, async (req, res, params, body) => {
      const result = await this.context.manageFaqItemsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/uploadcmsmedia`, async (req, res, params, body) => {
      const result = await this.context.uploadCmsMediaUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getpublishedpagebyslug`, async (req, res, params, body) => {
      const result = await this.context.getPublishedPageBySlugUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
