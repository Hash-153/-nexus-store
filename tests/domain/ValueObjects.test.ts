import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Money } from "../../src/shared/domain/value-objects/Money.ts";
import { Email } from "../../src/shared/domain/value-objects/Email.ts";
import { SKU } from "../../src/shared/domain/value-objects/SKU.ts";
import { Address } from "../../src/shared/domain/value-objects/Address.ts";
import { Quantity } from "../../src/shared/domain/value-objects/Quantity.ts";
import { ValidationError } from "../../src/shared/errors/DomainError.ts";

describe("Value Objects Domain Tests", () => {
  describe("Money", () => {
    test("creates money and calculates with integer precision", () => {
      const price = Money.create(19.99, "USD");
      assert.equal(price.amountInCents, 1999);
      assert.equal(price.amount, 19.99);
      assert.equal(price.currency, "USD");

      const shipping = Money.create(5.0, "USD");
      const total = price.add(shipping);
      assert.equal(total.amountInCents, 2499);
      assert.equal(total.amount, 24.99);

      const discount = Money.create(4.99, "USD");
      const afterDiscount = total.subtract(discount);
      assert.equal(afterDiscount.amountInCents, 2000);
      assert.equal(afterDiscount.amount, 20.0);
    });

    test("disallows negative amounts and cross-currency arithmetic", () => {
      assert.throws(() => Money.create(-10), ValidationError);

      const usd = Money.create(10, "USD");
      const eur = Money.create(10, "EUR");
      assert.throws(() => usd.add(eur), ValidationError);
    });
  });

  describe("Email", () => {
    test("validates and normalizes email strings", () => {
      const email = Email.create("  Customer@Example.Com  ");
      assert.equal(email.value, "customer@example.com");
    });

    test("rejects invalid email formats", () => {
      assert.throws(() => Email.create("invalid-email"), ValidationError);
      assert.throws(() => Email.create("user@.com"), ValidationError);
    });
  });

  describe("SKU", () => {
    test("validates and uppercase normalizes SKU format", () => {
      const sku = SKU.create(" prod-100-blk ");
      assert.equal(sku.value, "PROD-100-BLK");
    });

    test("rejects invalid characters or short SKUs", () => {
      assert.throws(() => SKU.create("a"), ValidationError);
      assert.throws(() => SKU.create("SKU with spaces!"), ValidationError);
    });
  });

  describe("Address", () => {
    test("creates and formats physical address correctly", () => {
      const address = Address.create({
        street: "123 Market St",
        unit: "Apt 4B",
        city: "San Francisco",
        stateOrProvince: "CA",
        postalCode: "94105",
        countryCode: "US",
      });

      assert.equal(address.countryCode, "US");
      assert.equal(
        address.format(),
        "123 Market St, Apt 4B, San Francisco, CA 94105, US"
      );
    });

    test("rejects incomplete address fields", () => {
      assert.throws(
        () =>
          Address.create({
            street: "",
            city: "SF",
            stateOrProvince: "CA",
            postalCode: "94105",
            countryCode: "US",
          }),
        ValidationError
      );
    });
  });

  describe("Quantity", () => {
    test("performs integer quantity operations safely", () => {
      const q1 = Quantity.create(5);
      const q2 = Quantity.create(3);
      const sum = q1.add(q2);
      assert.equal(sum.value, 8);

      const diff = q1.subtract(q2);
      assert.equal(diff.value, 2);
    });

    test("prevents negative quantities", () => {
      assert.throws(() => Quantity.create(-1), ValidationError);
      const q1 = Quantity.create(2);
      const q2 = Quantity.create(5);
      assert.throws(() => q1.subtract(q2), ValidationError);
    });
  });
});
