import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryProductRepository } from "../infrastructure/InMemoryProductRepository.ts";
import { InMemoryProductVariantRepository } from "../infrastructure/InMemoryProductVariantRepository.ts";
import { InMemoryCategoryRepository } from "../infrastructure/InMemoryCategoryRepository.ts";
import { InMemoryBrandRepository } from "../infrastructure/InMemoryBrandRepository.ts";
import { InMemoryCollectionRepository } from "../infrastructure/InMemoryCollectionRepository.ts";
import { InMemoryProductAttributeRepository } from "../infrastructure/InMemoryProductAttributeRepository.ts";
import { InMemoryAttributeValueRepository } from "../infrastructure/InMemoryAttributeValueRepository.ts";
import { InMemoryProductMediaRepository } from "../infrastructure/InMemoryProductMediaRepository.ts";
import { InMemoryPricingTierRepository } from "../infrastructure/InMemoryPricingTierRepository.ts";
import { InMemoryProductBundleRepository } from "../infrastructure/InMemoryProductBundleRepository.ts";
import { InMemoryProductTagRepository } from "../infrastructure/InMemoryProductTagRepository.ts";
import { InMemoryFacetFilterRepository } from "../infrastructure/InMemoryFacetFilterRepository.ts";
import { CreateProductUseCase } from "./CreateProductUseCase.ts";
import { UpdateProductUseCase } from "./UpdateProductUseCase.ts";
import { PublishProductUseCase } from "./PublishProductUseCase.ts";
import { ArchiveProductUseCase } from "./ArchiveProductUseCase.ts";
import { CreateVariantUseCase } from "./CreateVariantUseCase.ts";
import { UpdateVariantPricingUseCase } from "./UpdateVariantPricingUseCase.ts";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase.ts";
import { ReorderCategoriesUseCase } from "./ReorderCategoriesUseCase.ts";
import { CreateBrandUseCase } from "./CreateBrandUseCase.ts";
import { CreateCollectionUseCase } from "./CreateCollectionUseCase.ts";
import { AddProductToCollectionUseCase } from "./AddProductToCollectionUseCase.ts";
import { ManageAttributesUseCase } from "./ManageAttributesUseCase.ts";
import { UploadProductMediaUseCase } from "./UploadProductMediaUseCase.ts";
import { CreateProductBundleUseCase } from "./CreateProductBundleUseCase.ts";
import { SearchCatalogUseCase } from "./SearchCatalogUseCase.ts";
import { FilterProductsByFacetsUseCase } from "./FilterProductsByFacetsUseCase.ts";

export interface ProductCatalogModuleContext {
  productRepo: InMemoryProductRepository;
  productVariantRepo: InMemoryProductVariantRepository;
  categoryRepo: InMemoryCategoryRepository;
  brandRepo: InMemoryBrandRepository;
  collectionRepo: InMemoryCollectionRepository;
  productAttributeRepo: InMemoryProductAttributeRepository;
  attributeValueRepo: InMemoryAttributeValueRepository;
  productMediaRepo: InMemoryProductMediaRepository;
  pricingTierRepo: InMemoryPricingTierRepository;
  productBundleRepo: InMemoryProductBundleRepository;
  productTagRepo: InMemoryProductTagRepository;
  facetFilterRepo: InMemoryFacetFilterRepository;
  createProductUseCase: CreateProductUseCase;
  updateProductUseCase: UpdateProductUseCase;
  publishProductUseCase: PublishProductUseCase;
  archiveProductUseCase: ArchiveProductUseCase;
  createVariantUseCase: CreateVariantUseCase;
  updateVariantPricingUseCase: UpdateVariantPricingUseCase;
  createCategoryUseCase: CreateCategoryUseCase;
  reorderCategoriesUseCase: ReorderCategoriesUseCase;
  createBrandUseCase: CreateBrandUseCase;
  createCollectionUseCase: CreateCollectionUseCase;
  addProductToCollectionUseCase: AddProductToCollectionUseCase;
  manageAttributesUseCase: ManageAttributesUseCase;
  uploadProductMediaUseCase: UploadProductMediaUseCase;
  createProductBundleUseCase: CreateProductBundleUseCase;
  searchCatalogUseCase: SearchCatalogUseCase;
  filterProductsByFacetsUseCase: FilterProductsByFacetsUseCase;
}

export class ProductCatalogController {
  private readonly context: ProductCatalogModuleContext;

  constructor(eventBus: IEventBus) {
    const productRepo = new InMemoryProductRepository();
    const productVariantRepo = new InMemoryProductVariantRepository();
    const categoryRepo = new InMemoryCategoryRepository();
    const brandRepo = new InMemoryBrandRepository();
    const collectionRepo = new InMemoryCollectionRepository();
    const productAttributeRepo = new InMemoryProductAttributeRepository();
    const attributeValueRepo = new InMemoryAttributeValueRepository();
    const productMediaRepo = new InMemoryProductMediaRepository();
    const pricingTierRepo = new InMemoryPricingTierRepository();
    const productBundleRepo = new InMemoryProductBundleRepository();
    const productTagRepo = new InMemoryProductTagRepository();
    const facetFilterRepo = new InMemoryFacetFilterRepository();
    
    const createProductUseCase = new CreateProductUseCase(productRepo, eventBus);
    const updateProductUseCase = new UpdateProductUseCase(productVariantRepo, eventBus);
    const publishProductUseCase = new PublishProductUseCase(categoryRepo, eventBus);
    const archiveProductUseCase = new ArchiveProductUseCase(brandRepo, eventBus);
    const createVariantUseCase = new CreateVariantUseCase(collectionRepo, eventBus);
    const updateVariantPricingUseCase = new UpdateVariantPricingUseCase(productAttributeRepo, eventBus);
    const createCategoryUseCase = new CreateCategoryUseCase(attributeValueRepo, eventBus);
    const reorderCategoriesUseCase = new ReorderCategoriesUseCase(productMediaRepo, eventBus);
    const createBrandUseCase = new CreateBrandUseCase(pricingTierRepo, eventBus);
    const createCollectionUseCase = new CreateCollectionUseCase(productBundleRepo, eventBus);
    const addProductToCollectionUseCase = new AddProductToCollectionUseCase(productTagRepo, eventBus);
    const manageAttributesUseCase = new ManageAttributesUseCase(facetFilterRepo, eventBus);
    const uploadProductMediaUseCase = new UploadProductMediaUseCase(productRepo, eventBus);
    const createProductBundleUseCase = new CreateProductBundleUseCase(productVariantRepo, eventBus);
    const searchCatalogUseCase = new SearchCatalogUseCase(categoryRepo, eventBus);
    const filterProductsByFacetsUseCase = new FilterProductsByFacetsUseCase(brandRepo, eventBus);

    this.context = {
      productRepo,
      productVariantRepo,
      categoryRepo,
      brandRepo,
      collectionRepo,
      productAttributeRepo,
      attributeValueRepo,
      productMediaRepo,
      pricingTierRepo,
      productBundleRepo,
      productTagRepo,
      facetFilterRepo,
      createProductUseCase,
      updateProductUseCase,
      publishProductUseCase,
      archiveProductUseCase,
      createVariantUseCase,
      updateVariantPricingUseCase,
      createCategoryUseCase,
      reorderCategoriesUseCase,
      createBrandUseCase,
      createCollectionUseCase,
      addProductToCollectionUseCase,
      manageAttributesUseCase,
      uploadProductMediaUseCase,
      createProductBundleUseCase,
      searchCatalogUseCase,
      filterProductsByFacetsUseCase,
    };
  }

  public getContext(): ProductCatalogModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/product-catalog";

    
    router.register("GET", `${basePath}/products`, async (req, res) => {
      const items = await this.context.productRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/products/:id`, async (req, res, params) => {
      const item = await this.context.productRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productvariants`, async (req, res) => {
      const items = await this.context.productVariantRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productvariants/:id`, async (req, res, params) => {
      const item = await this.context.productVariantRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductVariant not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/categorys`, async (req, res) => {
      const items = await this.context.categoryRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/categorys/:id`, async (req, res, params) => {
      const item = await this.context.categoryRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Category not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/brands`, async (req, res) => {
      const items = await this.context.brandRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/brands/:id`, async (req, res, params) => {
      const item = await this.context.brandRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Brand not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/collections`, async (req, res) => {
      const items = await this.context.collectionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/collections/:id`, async (req, res, params) => {
      const item = await this.context.collectionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Collection not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productattributes`, async (req, res) => {
      const items = await this.context.productAttributeRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productattributes/:id`, async (req, res, params) => {
      const item = await this.context.productAttributeRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductAttribute not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/attributevalues`, async (req, res) => {
      const items = await this.context.attributeValueRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/attributevalues/:id`, async (req, res, params) => {
      const item = await this.context.attributeValueRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "AttributeValue not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productmedias`, async (req, res) => {
      const items = await this.context.productMediaRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productmedias/:id`, async (req, res, params) => {
      const item = await this.context.productMediaRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductMedia not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pricingtiers`, async (req, res) => {
      const items = await this.context.pricingTierRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pricingtiers/:id`, async (req, res, params) => {
      const item = await this.context.pricingTierRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PricingTier not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productbundles`, async (req, res) => {
      const items = await this.context.productBundleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productbundles/:id`, async (req, res, params) => {
      const item = await this.context.productBundleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductBundle not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/producttags`, async (req, res) => {
      const items = await this.context.productTagRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/producttags/:id`, async (req, res, params) => {
      const item = await this.context.productTagRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductTag not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/facetfilters`, async (req, res) => {
      const items = await this.context.facetFilterRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/facetfilters/:id`, async (req, res, params) => {
      const item = await this.context.facetFilterRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "FacetFilter not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createproduct`, async (req, res, params, body) => {
      const result = await this.context.createProductUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updateproduct`, async (req, res, params, body) => {
      const result = await this.context.updateProductUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/publishproduct`, async (req, res, params, body) => {
      const result = await this.context.publishProductUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/archiveproduct`, async (req, res, params, body) => {
      const result = await this.context.archiveProductUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createvariant`, async (req, res, params, body) => {
      const result = await this.context.createVariantUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatevariantpricing`, async (req, res, params, body) => {
      const result = await this.context.updateVariantPricingUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createcategory`, async (req, res, params, body) => {
      const result = await this.context.createCategoryUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/reordercategories`, async (req, res, params, body) => {
      const result = await this.context.reorderCategoriesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createbrand`, async (req, res, params, body) => {
      const result = await this.context.createBrandUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createcollection`, async (req, res, params, body) => {
      const result = await this.context.createCollectionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/addproducttocollection`, async (req, res, params, body) => {
      const result = await this.context.addProductToCollectionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/manageattributes`, async (req, res, params, body) => {
      const result = await this.context.manageAttributesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/uploadproductmedia`, async (req, res, params, body) => {
      const result = await this.context.uploadProductMediaUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createproductbundle`, async (req, res, params, body) => {
      const result = await this.context.createProductBundleUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/searchcatalog`, async (req, res, params, body) => {
      const result = await this.context.searchCatalogUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/filterproductsbyfacets`, async (req, res, params, body) => {
      const result = await this.context.filterProductsByFacetsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
