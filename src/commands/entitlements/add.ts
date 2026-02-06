import { Args, Command, Flags } from "@oclif/core";
import { RevenueCatAPI } from "../../services/revenuecat-api.js";

/**
 * Parses a duration or date string and returns milliseconds since epoch
 * Supports: duration format (7d, 2h, 1w), ISO 8601 dates, or "never"
 */
function parseExpirationTime(input: string): number {
  // Handle "never" - set to 100 years from now
  if (input.toLowerCase() === "never") {
    return Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
  }

  // Check for duration format: number followed by unit (m, h, d, w, M, y)
  const durationMatch = input.match(/^(\d+)([mhdwMy])$/);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]!, 10);
    const unit = durationMatch[2]! as "m" | "h" | "d" | "w" | "M" | "y";

    const now = Date.now();
    const msPerUnit: Record<"m" | "h" | "d" | "w" | "M" | "y", number> = {
      m: 60 * 1000, // minutes
      h: 60 * 60 * 1000, // hours
      d: 24 * 60 * 60 * 1000, // days
      w: 7 * 24 * 60 * 60 * 1000, // weeks
      M: 30 * 24 * 60 * 60 * 1000, // months (approximate)
      y: 365 * 24 * 60 * 60 * 1000, // years (approximate)
    };

    return now + value * msPerUnit[unit];
  }

  // Try parsing as ISO 8601 date
  const date = new Date(input);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }

  throw new Error(
    `Invalid expiration format: "${input}". Use duration (e.g., 7d, 2h, 1w), ISO 8601 date (e.g., 2026-02-15T14:30:00Z), or "never".`,
  );
}

export default class EntitlementsAdd extends Command {
  static override args = {
    userId: Args.string({
      description: "RevenueCat app user ID",
      required: true,
    }),
    entitlementId: Args.string({
      description: "Entitlement ID to grant",
      required: true,
    }),
    expiration: Args.string({
      description:
        "Expiration time (e.g., 7d, 2h, 1w, 2026-02-15T14:30:00Z, or never)",
      required: true,
    }),
  };

  static override description =
    "Grant an entitlement to a customer with expiration";

  static override examples = [
    "<%= config.bin %> <%= command.id %> user123 entla1b2c3d4e5 7d",
    "<%= config.bin %> <%= command.id %> user123 entla1b2c3d4e5 2h",
    "<%= config.bin %> <%= command.id %> user123 entla1b2c3d4e5 2026-02-15T14:30:00Z",
    "<%= config.bin %> <%= command.id %> user123 entla1b2c3d4e5 never",
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
    const { args, flags } = await this.parse(EntitlementsAdd);

    const api = new RevenueCatAPI(flags.apiKey, flags.projectId);

    try {
      // Parse the expiration time
      const expiresAtMs = parseExpirationTime(args.expiration);
      const expiresAtDate = new Date(expiresAtMs);

      // Grant the entitlement
      await api.grantEntitlement(args.userId, args.entitlementId, expiresAtMs);

      this.log(
        `✓ Successfully granted entitlement ${args.entitlementId} to user ${args.userId}`,
      );
      this.log(
        `  Expires: ${expiresAtDate.toLocaleString("en-UK", {
          dateStyle: "full",
          timeStyle: "long",
        })}`,
      );
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error), {
        exit: 1,
      });
    }
  }
}
