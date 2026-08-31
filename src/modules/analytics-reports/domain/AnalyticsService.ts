import type { IOrderRepository } from "../../order-management/domain/IOrderRepository.ts";
import type { IProductRepository } from "../../product-catalog/domain/IProductRepository.ts";
import { OrderStatus } from "../../order-management/domain/OrderStatus.ts";
import { Money, type Currency } from "../../../shared/domain/value-objects/Money.ts";

export interface SalesSummary {
  totalOrders: number;
  paidOrders: number;
  grossRevenue: number;
  netRevenue: number;
  totalDiscountsGiven: number;
  currency: Currency;
  topSellingProducts: Array<{
    productId: string;
    title: string;
    unitsSold: number;
    revenue: number;
  }>;
}

export class AnalyticsService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) {}

  public async getSalesSummary(currency: Currency = "USD"): Promise<SalesSummary> {
    const allOrders = (await this.orderRepository.findAll?.()) ?? [];
    
    const paidOrders = allOrders.filter(
      (o) =>
        o.status === OrderStatus.PAID ||
        o.status === OrderStatus.PROCESSING ||
        o.status === OrderStatus.SHIPPED ||
        o.status === OrderStatus.DELIVERED
    );

    let grossRevenue = Money.zero(currency);
    let netRevenue = Money.zero(currency);
    let totalDiscounts = Money.zero(currency);

    const productSalesMap = new Map<string, { title: string; units: number; revenue: Money }>();

    for (const order of paidOrders) {
      grossRevenue = grossRevenue.add(order.subtotal);
      netRevenue = netRevenue.add(order.total);
      totalDiscounts = totalDiscounts.add(order.discountTotal);

      for (const item of order.items) {
        const existing = productSalesMap.get(item.productId);
        if (existing) {
          existing.units += item.quantity.value;
          existing.revenue = existing.revenue.add(item.lineTotal);
        } else {
          productSalesMap.set(item.productId, {
            title: item.title,
            units: item.quantity.value,
            revenue: item.lineTotal,
          });
        }
      }
    }

    const topSelling = Array.from(productSalesMap.entries())
      .map(([productId, data]) => ({
        productId,
        title: data.title,
        unitsSold: data.units,
        revenue: data.revenue.amount,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10);

    return {
      totalOrders: allOrders.length,
      paidOrders: paidOrders.length,
      grossRevenue: grossRevenue.amount,
      netRevenue: netRevenue.amount,
      totalDiscountsGiven: totalDiscounts.amount,
      currency,
      topSellingProducts: topSelling,
    };
  }
}
