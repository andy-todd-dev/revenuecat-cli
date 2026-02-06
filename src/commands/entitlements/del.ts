import { Args, Command, Flags } from "@oclif/core";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

export default class EntitlementsDel extends Command {
  static override args = {
    userId: Args.string({
      description: "RevenueCat app user ID",
      required: true,
    }),
    entitlementId: Args.string({
      description: "Entitlement ID to revoke",
      required: true,
    }),
  };

  static override description = "Revoke a granted entitlement from a customer";

  static override examples = [
    "<%= config.bin %> <%= command.id %> user123 entla1b2c3d4e5",
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
    const { args, flags } = await this.parse(EntitlementsDel);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      await api.revokeEntitlement(args.userId, args.entitlementId);

      this.log(
        `✓ Successfully revoked entitlement ${args.entitlementId} from user ${args.userId}`,
      );
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
