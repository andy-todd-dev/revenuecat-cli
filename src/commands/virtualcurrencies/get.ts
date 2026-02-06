import { Args, Command, Flags } from "@oclif/core";
import { createTable } from "@visulima/tabular";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

export default class VirtualcurrenciesGet extends Command {
  static override args = {
    userId: Args.string({
      description: "RevenueCat app user ID",
      required: true,
    }),
  };

  static override description =
    "Fetch virtual currency balances for a customer from RevenueCat V2 API";

  static override examples = [
    "<%= config.bin %> <%= command.id %> user123",
    "<%= config.bin %> <%= command.id %> $RCAnonymousID:abc123",
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
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(VirtualcurrenciesGet);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      const data = await api.getVirtualCurrencies(args.userId);

      if (!data.items || data.items.length === 0) {
        this.log("No virtual currency balances found for this customer.");
        return;
      }

      // Format data for table display
      const tableInstance = createTable();
      tableInstance.setHeaders(["Currency", "Code", "Balance", "Description"]);

      for (const item of data.items) {
        const name = item.name || item.currency_code;
        const code = item.currency_code;
        const description = item.description || "-";

        tableInstance.addRow([
          name,
          code,
          item.balance.toString(),
          description,
        ]);
      }

      this.log(tableInstance.toString());
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
