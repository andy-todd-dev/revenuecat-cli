import { Args, Command, Flags } from "@oclif/core";
import { createTable } from "@visulima/tabular";
import type { ActiveEntitlementsResponse } from "../../services/revenuecat-api.js";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

export default class EntitlementsGet extends Command {
  static override args = {
    userId: Args.string({
      description:
        "RevenueCat app user ID (optional - if omitted, lists all entitlements)",
      required: false,
    }),
  };

  static override description =
    "Fetch active entitlements for a customer or list all entitlements in the project";

  static override examples = [
    "<%= config.bin %> <%= command.id %> user123",
    "<%= config.bin %> <%= command.id %> $RCAnonymousID:abc123",
    "<%= config.bin %> <%= command.id %>",
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
    const { args, flags } = await this.parse(EntitlementsGet);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      // If userId is provided, fetch customer's active entitlements
      if (args.userId) {
        const data = await api.getEntitlements(args.userId);

        if (!data.items || data.items.length === 0) {
          this.log("No active entitlements found for this customer.");
          return;
        }

        // Fetch entitlement details for each active entitlement to get display names
        const entitlementDetails = await Promise.all(
          data.items.map(async (item) => {
            try {
              const details = await api.getEntitlement(item.entitlement_id);
              return {
                id: item.entitlement_id,
                name:
                  (details as { display_name?: string }).display_name ||
                  item.entitlement_id,
                expiresAt: item.expires_at,
              };
            } catch (error) {
              // If we can't fetch details, use the ID as name
              return {
                id: item.entitlement_id,
                name: item.entitlement_id,
                expiresAt: item.expires_at,
              };
            }
          }),
        );

        // Format data for table display
        const tableInstance = createTable();
        tableInstance.setHeaders(["ID", "Entitlement", "Expires At"]);

        for (const item of entitlementDetails) {
          const expiresAt = item.expiresAt
            ? new Date(item.expiresAt).toLocaleString("en-UK", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "Never";

          tableInstance.addRow([item.id, item.name, expiresAt]);
        }

        this.log(tableInstance.toString());
      } else {
        // If userId is not provided, list all entitlements in the project
        const data = await api.listEntitlements();

        if (!data.items || data.items.length === 0) {
          this.log("No entitlements found in this project.");
          return;
        }

        // Format data for table display
        const tableInstance = createTable();
        tableInstance.setHeaders(["ID", "Name"]);

        for (const item of data.items) {
          tableInstance.addRow([item.id, item.display_name]);
        }

        this.log(tableInstance.toString());
      }
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
