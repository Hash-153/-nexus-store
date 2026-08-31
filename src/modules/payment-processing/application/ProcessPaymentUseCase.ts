import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { ProcessPaymentDTO, PaymentResponseDTO } from "./dtos/PaymentDTOs.ts";
import type { IPaymentRepository } from "../domain/IPaymentRepository.ts";
import type { IPaymentGateway } from "../domain/IPaymentGateway.ts";
import type { IOrderRepository } from "../../order-management/domain/IOrderRepository.ts";
import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Payment } from "../domain/Payment.ts";
import { OrderStatus } from "../../order-management/domain/OrderStatus.ts";
import { NotFoundError, BusinessRuleViolationError } from "../../../shared/errors/DomainError.ts";

export class ProcessPaymentUseCase implements IUseCase<ProcessPaymentDTO, PaymentResponseDTO> {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly orderRepository: IOrderRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(dto: ProcessPaymentDTO): Promise<PaymentResponseDTO> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundError("Order", dto.orderId);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BusinessRuleViolationError(
        `Cannot process payment for order in '${order.status}' status.`
      );
    }

    const payment = Payment.create({
      orderId: order.id,
      amount: order.total,
      method: dto.method,
    });

    const gatewayResult = await this.paymentGateway.charge({
      amount: order.total,
      method: dto.method,
      paymentDetails: dto.paymentDetails,
    });

    if (gatewayResult.success && gatewayResult.transactionReference) {
      payment.markAsCaptured(gatewayResult.transactionReference);
      order.markAsPaid();
      await this.orderRepository.save(order);
      await this.eventBus.publishAll(order.domainEvents);
      order.clearEvents();
    } else {
      payment.markAsFailed(gatewayResult.errorMessage ?? "Payment processing failed.");
    }

    await this.paymentRepository.save(payment);
    await this.eventBus.publishAll(payment.domainEvents);
    payment.clearEvents();

    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      method: payment.method,
      status: payment.status,
      transactionReference: payment.transactionReference,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt.toISOString(),
    };
  }
}
