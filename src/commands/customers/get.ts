import { Args, Command, Flags } from "@oclif/core";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

export default class CustomersGet extends Command {
  static override args = {
    userId: Args.string({
      description: "RevenueCat app user ID",
      required: true,
    }),
  };

  static override description = "Fetch customer data from RevenueCat V2 API";

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
    const { args, flags } = await this.parse(CustomersGet);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      const data = await api.getCustomer(args.userId);

      this.log(JSON.stringify(data, null, 2));
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
