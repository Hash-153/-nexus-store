import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryReviewRepository } from "../infrastructure/InMemoryReviewRepository.ts";
import { InMemoryReviewMediaRepository } from "../infrastructure/InMemoryReviewMediaRepository.ts";
import { InMemoryHelpfulVoteRepository } from "../infrastructure/InMemoryHelpfulVoteRepository.ts";
import { InMemoryProductQuestionRepository } from "../infrastructure/InMemoryProductQuestionRepository.ts";
import { InMemoryProductAnswerRepository } from "../infrastructure/InMemoryProductAnswerRepository.ts";
import { InMemoryReviewModerationItemRepository } from "../infrastructure/InMemoryReviewModerationItemRepository.ts";
import { InMemoryRatingSummaryRepository } from "../infrastructure/InMemoryRatingSummaryRepository.ts";
import { InMemoryCustomerBadgeRepository } from "../infrastructure/InMemoryCustomerBadgeRepository.ts";
import { CreateReviewUseCase } from "./CreateReviewUseCase.ts";
import { UpdateReviewUseCase } from "./UpdateReviewUseCase.ts";
import { ApproveReviewUseCase } from "./ApproveReviewUseCase.ts";
import { RejectReviewUseCase } from "./RejectReviewUseCase.ts";
import { VoteReviewHelpfulUseCase } from "./VoteReviewHelpfulUseCase.ts";
import { PostProductQuestionUseCase } from "./PostProductQuestionUseCase.ts";
import { AnswerProductQuestionUseCase } from "./AnswerProductQuestionUseCase.ts";
import { GetProductReviewsUseCase } from "./GetProductReviewsUseCase.ts";
import { GetProductRatingBreakdownUseCase } from "./GetProductRatingBreakdownUseCase.ts";
import { ReportAbusiveReviewUseCase } from "./ReportAbusiveReviewUseCase.ts";

export interface ReviewsRatingsModuleContext {
  reviewRepo: InMemoryReviewRepository;
  reviewMediaRepo: InMemoryReviewMediaRepository;
  helpfulVoteRepo: InMemoryHelpfulVoteRepository;
  productQuestionRepo: InMemoryProductQuestionRepository;
  productAnswerRepo: InMemoryProductAnswerRepository;
  reviewModerationItemRepo: InMemoryReviewModerationItemRepository;
  ratingSummaryRepo: InMemoryRatingSummaryRepository;
  customerBadgeRepo: InMemoryCustomerBadgeRepository;
  createReviewUseCase: CreateReviewUseCase;
  updateReviewUseCase: UpdateReviewUseCase;
  approveReviewUseCase: ApproveReviewUseCase;
  rejectReviewUseCase: RejectReviewUseCase;
  voteReviewHelpfulUseCase: VoteReviewHelpfulUseCase;
  postProductQuestionUseCase: PostProductQuestionUseCase;
  answerProductQuestionUseCase: AnswerProductQuestionUseCase;
  getProductReviewsUseCase: GetProductReviewsUseCase;
  getProductRatingBreakdownUseCase: GetProductRatingBreakdownUseCase;
  reportAbusiveReviewUseCase: ReportAbusiveReviewUseCase;
}

export class ReviewsRatingsController {
  private readonly context: ReviewsRatingsModuleContext;

  constructor(eventBus: IEventBus) {
    const reviewRepo = new InMemoryReviewRepository();
    const reviewMediaRepo = new InMemoryReviewMediaRepository();
    const helpfulVoteRepo = new InMemoryHelpfulVoteRepository();
    const productQuestionRepo = new InMemoryProductQuestionRepository();
    const productAnswerRepo = new InMemoryProductAnswerRepository();
    const reviewModerationItemRepo = new InMemoryReviewModerationItemRepository();
    const ratingSummaryRepo = new InMemoryRatingSummaryRepository();
    const customerBadgeRepo = new InMemoryCustomerBadgeRepository();
    
    const createReviewUseCase = new CreateReviewUseCase(reviewRepo, eventBus);
    const updateReviewUseCase = new UpdateReviewUseCase(reviewMediaRepo, eventBus);
    const approveReviewUseCase = new ApproveReviewUseCase(helpfulVoteRepo, eventBus);
    const rejectReviewUseCase = new RejectReviewUseCase(productQuestionRepo, eventBus);
    const voteReviewHelpfulUseCase = new VoteReviewHelpfulUseCase(productAnswerRepo, eventBus);
    const postProductQuestionUseCase = new PostProductQuestionUseCase(reviewModerationItemRepo, eventBus);
    const answerProductQuestionUseCase = new AnswerProductQuestionUseCase(ratingSummaryRepo, eventBus);
    const getProductReviewsUseCase = new GetProductReviewsUseCase(customerBadgeRepo, eventBus);
    const getProductRatingBreakdownUseCase = new GetProductRatingBreakdownUseCase(reviewRepo, eventBus);
    const reportAbusiveReviewUseCase = new ReportAbusiveReviewUseCase(reviewMediaRepo, eventBus);

    this.context = {
      reviewRepo,
      reviewMediaRepo,
      helpfulVoteRepo,
      productQuestionRepo,
      productAnswerRepo,
      reviewModerationItemRepo,
      ratingSummaryRepo,
      customerBadgeRepo,
      createReviewUseCase,
      updateReviewUseCase,
      approveReviewUseCase,
      rejectReviewUseCase,
      voteReviewHelpfulUseCase,
      postProductQuestionUseCase,
      answerProductQuestionUseCase,
      getProductReviewsUseCase,
      getProductRatingBreakdownUseCase,
      reportAbusiveReviewUseCase,
    };
  }

  public getContext(): ReviewsRatingsModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/reviews-ratings";

    
    router.register("GET", `${basePath}/reviews`, async (req, res) => {
      const items = await this.context.reviewRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/reviews/:id`, async (req, res, params) => {
      const item = await this.context.reviewRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Review not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/reviewmedias`, async (req, res) => {
      const items = await this.context.reviewMediaRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/reviewmedias/:id`, async (req, res, params) => {
      const item = await this.context.reviewMediaRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ReviewMedia not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/helpfulvotes`, async (req, res) => {
      const items = await this.context.helpfulVoteRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/helpfulvotes/:id`, async (req, res, params) => {
      const item = await this.context.helpfulVoteRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "HelpfulVote not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productquestions`, async (req, res) => {
      const items = await this.context.productQuestionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productquestions/:id`, async (req, res, params) => {
      const item = await this.context.productQuestionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductQuestion not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/productanswers`, async (req, res) => {
      const items = await this.context.productAnswerRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/productanswers/:id`, async (req, res, params) => {
      const item = await this.context.productAnswerRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ProductAnswer not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/reviewmoderationitems`, async (req, res) => {
      const items = await this.context.reviewModerationItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/reviewmoderationitems/:id`, async (req, res, params) => {
      const item = await this.context.reviewModerationItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ReviewModerationItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ratingsummarys`, async (req, res) => {
      const items = await this.context.ratingSummaryRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ratingsummarys/:id`, async (req, res, params) => {
      const item = await this.context.ratingSummaryRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RatingSummary not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/customerbadges`, async (req, res) => {
      const items = await this.context.customerBadgeRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/customerbadges/:id`, async (req, res, params) => {
      const item = await this.context.customerBadgeRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CustomerBadge not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createreview`, async (req, res, params, body) => {
      const result = await this.context.createReviewUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatereview`, async (req, res, params, body) => {
      const result = await this.context.updateReviewUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/approvereview`, async (req, res, params, body) => {
      const result = await this.context.approveReviewUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/rejectreview`, async (req, res, params, body) => {
      const result = await this.context.rejectReviewUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/votereviewhelpful`, async (req, res, params, body) => {
      const result = await this.context.voteReviewHelpfulUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/postproductquestion`, async (req, res, params, body) => {
      const result = await this.context.postProductQuestionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/answerproductquestion`, async (req, res, params, body) => {
      const result = await this.context.answerProductQuestionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getproductreviews`, async (req, res, params, body) => {
      const result = await this.context.getProductReviewsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getproductratingbreakdown`, async (req, res, params, body) => {
      const result = await this.context.getProductRatingBreakdownUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/reportabusivereview`, async (req, res, params, body) => {
      const result = await this.context.reportAbusiveReviewUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
