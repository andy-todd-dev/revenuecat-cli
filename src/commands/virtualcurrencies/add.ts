import { Args, Command, Flags } from "@oclif/core";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

export default class VirtualcurrenciesAdd extends Command {
  static override args = {
    userId: Args.string({
      description: "RevenueCat app user ID",
      required: true,
    }),
    currencyCode: Args.string({
      description: "Virtual currency code",
      required: true,
    }),
    amount: Args.integer({
      description: "Amount to add (use negative value to subtract)",
      required: true,
    }),
  };

  static override description =
    "Add or subtract virtual currency balance for a customer";

  static override examples = [
    "<%= config.bin %> <%= command.id %> user123 gems 100",
    "<%= config.bin %> <%= command.id %> $RCAnonymousID:abc123 coins -50",
  ];

  static override flags = {
    apiKey: Flags.string({
      char: "k",
      description: "RevenueCat API key",
      env: "REVENUECAT_API_KEY",
      required: true,
    }),
    projectId: Flags.string({
      char: "p",
      description: "RevenueCat project ID",
      env: "REVENUECAT_PROJECT_ID",
      required: true,
    }),
    reference: Flags.string({
      char: "r",
      description: "Optional reference for the transaction",
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(VirtualcurrenciesAdd);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      const adjustments = {
        [args.currencyCode]: args.amount,
      };

      const result = await api.updateVirtualCurrencyBalance(
        args.userId,
        adjustments,
        flags.reference,
      );

      // Find the updated balance for the specified currency
      const updatedCurrency = result.items.find(
        (item) => item.currency_code === args.currencyCode,
      );

      if (updatedCurrency) {
        const currencyName = updatedCurrency.name || args.currencyCode;
        this.log(
          `✓ Successfully updated ${currencyName}. New balance: ${updatedCurrency.balance}`,
        );
      } else {
        this.log("✓ Virtual currency balance updated successfully");
      }
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
