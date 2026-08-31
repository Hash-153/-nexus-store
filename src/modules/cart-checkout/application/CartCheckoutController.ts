import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryCartRepository } from "../infrastructure/InMemoryCartRepository.ts";
import { InMemoryCartItemRepository } from "../infrastructure/InMemoryCartItemRepository.ts";
import { InMemorySavedForLaterItemRepository } from "../infrastructure/InMemorySavedForLaterItemRepository.ts";
import { InMemoryCheckoutSessionRepository } from "../infrastructure/InMemoryCheckoutSessionRepository.ts";
import { InMemoryTaxBreakdownRepository } from "../infrastructure/InMemoryTaxBreakdownRepository.ts";
import { InMemoryShippingOptionRepository } from "../infrastructure/InMemoryShippingOptionRepository.ts";
import { InMemoryCartDiscountRepository } from "../infrastructure/InMemoryCartDiscountRepository.ts";
import { InMemoryCurrencyConversionRepository } from "../infrastructure/InMemoryCurrencyConversionRepository.ts";
import { CreateCartUseCase } from "./CreateCartUseCase.ts";
import { AddItemToCartUseCase } from "./AddItemToCartUseCase.ts";
import { UpdateCartItemQuantityUseCase } from "./UpdateCartItemQuantityUseCase.ts";
import { RemoveItemFromCartUseCase } from "./RemoveItemFromCartUseCase.ts";
import { SaveForLaterUseCase } from "./SaveForLaterUseCase.ts";
import { MoveToCartUseCase } from "./MoveToCartUseCase.ts";
import { ApplyPromoCodeUseCase } from "./ApplyPromoCodeUseCase.ts";
import { RemovePromoCodeUseCase } from "./RemovePromoCodeUseCase.ts";
import { CalculateCartTaxesUseCase } from "./CalculateCartTaxesUseCase.ts";
import { EstimateShippingRatesUseCase } from "./EstimateShippingRatesUseCase.ts";
import { InitializeCheckoutUseCase } from "./InitializeCheckoutUseCase.ts";
import { ValidateCheckoutPreconditionsUseCase } from "./ValidateCheckoutPreconditionsUseCase.ts";
import { ConvertCartCurrencyUseCase } from "./ConvertCartCurrencyUseCase.ts";

export interface CartCheckoutModuleContext {
  cartRepo: InMemoryCartRepository;
  cartItemRepo: InMemoryCartItemRepository;
  savedForLaterItemRepo: InMemorySavedForLaterItemRepository;
  checkoutSessionRepo: InMemoryCheckoutSessionRepository;
  taxBreakdownRepo: InMemoryTaxBreakdownRepository;
  shippingOptionRepo: InMemoryShippingOptionRepository;
  cartDiscountRepo: InMemoryCartDiscountRepository;
  currencyConversionRepo: InMemoryCurrencyConversionRepository;
  createCartUseCase: CreateCartUseCase;
  addItemToCartUseCase: AddItemToCartUseCase;
  updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase;
  removeItemFromCartUseCase: RemoveItemFromCartUseCase;
  saveForLaterUseCase: SaveForLaterUseCase;
  moveToCartUseCase: MoveToCartUseCase;
  applyPromoCodeUseCase: ApplyPromoCodeUseCase;
  removePromoCodeUseCase: RemovePromoCodeUseCase;
  calculateCartTaxesUseCase: CalculateCartTaxesUseCase;
  estimateShippingRatesUseCase: EstimateShippingRatesUseCase;
  initializeCheckoutUseCase: InitializeCheckoutUseCase;
  validateCheckoutPreconditionsUseCase: ValidateCheckoutPreconditionsUseCase;
  convertCartCurrencyUseCase: ConvertCartCurrencyUseCase;
}

export class CartCheckoutController {
  private readonly context: CartCheckoutModuleContext;

  constructor(eventBus: IEventBus) {
    const cartRepo = new InMemoryCartRepository();
    const cartItemRepo = new InMemoryCartItemRepository();
    const savedForLaterItemRepo = new InMemorySavedForLaterItemRepository();
    const checkoutSessionRepo = new InMemoryCheckoutSessionRepository();
    const taxBreakdownRepo = new InMemoryTaxBreakdownRepository();
    const shippingOptionRepo = new InMemoryShippingOptionRepository();
    const cartDiscountRepo = new InMemoryCartDiscountRepository();
    const currencyConversionRepo = new InMemoryCurrencyConversionRepository();
    
    const createCartUseCase = new CreateCartUseCase(cartRepo, eventBus);
    const addItemToCartUseCase = new AddItemToCartUseCase(cartItemRepo, eventBus);
    const updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(savedForLaterItemRepo, eventBus);
    const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(checkoutSessionRepo, eventBus);
    const saveForLaterUseCase = new SaveForLaterUseCase(taxBreakdownRepo, eventBus);
    const moveToCartUseCase = new MoveToCartUseCase(shippingOptionRepo, eventBus);
    const applyPromoCodeUseCase = new ApplyPromoCodeUseCase(cartDiscountRepo, eventBus);
    const removePromoCodeUseCase = new RemovePromoCodeUseCase(currencyConversionRepo, eventBus);
    const calculateCartTaxesUseCase = new CalculateCartTaxesUseCase(cartRepo, eventBus);
    const estimateShippingRatesUseCase = new EstimateShippingRatesUseCase(cartItemRepo, eventBus);
    const initializeCheckoutUseCase = new InitializeCheckoutUseCase(savedForLaterItemRepo, eventBus);
    const validateCheckoutPreconditionsUseCase = new ValidateCheckoutPreconditionsUseCase(checkoutSessionRepo, eventBus);
    const convertCartCurrencyUseCase = new ConvertCartCurrencyUseCase(taxBreakdownRepo, eventBus);

    this.context = {
      cartRepo,
      cartItemRepo,
      savedForLaterItemRepo,
      checkoutSessionRepo,
      taxBreakdownRepo,
      shippingOptionRepo,
      cartDiscountRepo,
      currencyConversionRepo,
      createCartUseCase,
      addItemToCartUseCase,
      updateCartItemQuantityUseCase,
      removeItemFromCartUseCase,
      saveForLaterUseCase,
      moveToCartUseCase,
      applyPromoCodeUseCase,
      removePromoCodeUseCase,
      calculateCartTaxesUseCase,
      estimateShippingRatesUseCase,
      initializeCheckoutUseCase,
      validateCheckoutPreconditionsUseCase,
      convertCartCurrencyUseCase,
    };
  }

  public getContext(): CartCheckoutModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/cart-checkout";

    
    router.register("GET", `${basePath}/carts`, async (req, res) => {
      const items = await this.context.cartRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/carts/:id`, async (req, res, params) => {
      const item = await this.context.cartRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Cart not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/cartitems`, async (req, res) => {
      const items = await this.context.cartItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/cartitems/:id`, async (req, res, params) => {
      const item = await this.context.cartItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CartItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/savedforlateritems`, async (req, res) => {
      const items = await this.context.savedForLaterItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/savedforlateritems/:id`, async (req, res, params) => {
      const item = await this.context.savedForLaterItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "SavedForLaterItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/checkoutsessions`, async (req, res) => {
      const items = await this.context.checkoutSessionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/checkoutsessions/:id`, async (req, res, params) => {
      const item = await this.context.checkoutSessionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CheckoutSession not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/taxbreakdowns`, async (req, res) => {
      const items = await this.context.taxBreakdownRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/taxbreakdowns/:id`, async (req, res, params) => {
      const item = await this.context.taxBreakdownRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TaxBreakdown not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/shippingoptions`, async (req, res) => {
      const items = await this.context.shippingOptionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/shippingoptions/:id`, async (req, res, params) => {
      const item = await this.context.shippingOptionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ShippingOption not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/cartdiscounts`, async (req, res) => {
      const items = await this.context.cartDiscountRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/cartdiscounts/:id`, async (req, res, params) => {
      const item = await this.context.cartDiscountRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CartDiscount not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/currencyconversions`, async (req, res) => {
      const items = await this.context.currencyConversionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/currencyconversions/:id`, async (req, res, params) => {
      const item = await this.context.currencyConversionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CurrencyConversion not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createcart`, async (req, res, params, body) => {
      const result = await this.context.createCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/additemtocart`, async (req, res, params, body) => {
      const result = await this.context.addItemToCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatecartitemquantity`, async (req, res, params, body) => {
      const result = await this.context.updateCartItemQuantityUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/removeitemfromcart`, async (req, res, params, body) => {
      const result = await this.context.removeItemFromCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/saveforlater`, async (req, res, params, body) => {
      const result = await this.context.saveForLaterUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/movetocart`, async (req, res, params, body) => {
      const result = await this.context.moveToCartUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/applypromocode`, async (req, res, params, body) => {
      const result = await this.context.applyPromoCodeUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/removepromocode`, async (req, res, params, body) => {
      const result = await this.context.removePromoCodeUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/calculatecarttaxes`, async (req, res, params, body) => {
      const result = await this.context.calculateCartTaxesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/estimateshippingrates`, async (req, res, params, body) => {
      const result = await this.context.estimateShippingRatesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/initializecheckout`, async (req, res, params, body) => {
      const result = await this.context.initializeCheckoutUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/validatecheckoutpreconditions`, async (req, res, params, body) => {
      const result = await this.context.validateCheckoutPreconditionsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/convertcartcurrency`, async (req, res, params, body) => {
      const result = await this.context.convertCartCurrencyUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
