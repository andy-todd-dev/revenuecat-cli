const API_BASE_URL = "https://api.revenuecat.com/v2" as const;

export type CustomerData = Record<string, unknown>;
export type EntitlementsData = Record<string, unknown>;
export type EntitlementData = Record<string, unknown>;

export interface CustomerEntitlement {
  object: string;
  entitlement_id: string;
  expires_at: number | null;
}

export interface ActiveEntitlementsResponse {
  object: string;
  items: CustomerEntitlement[];
  next_page: string | null;
  url: string;
}

export interface VirtualCurrencyBalance {
  object: string;
  currency_code: string;
  balance: number;
  description?: string;
  name?: string;
}

export interface VirtualCurrenciesBalancesResponse {
  object: string;
  items: VirtualCurrencyBalance[];
  next_page: string | null;
  url: string;
}

export interface Entitlement {
  object: string;
  project_id: string;
  id: string;
  lookup_key: string;
  display_name: string;
  created_at: number;
}

export interface ListEntitlementsResponse {
  object: string;
  items: Entitlement[];
  next_page: string | null;
  url: string;
}

export class RevenueCatAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly statusText?: string,
  ) {
    super(message);
    this.name = "RevenueCatAPIError";
  }
}

/**
 * RevenueCat API client for interacting with the RevenueCat V2 API
 */
export class RevenueCatAPI {
  private readonly apiKey: string;
  private readonly projectId: string;
  private readonly baseUrl: string;

  /**
   * Creates a new RevenueCat API client instance
   * @param apiKey - The RevenueCat API key
   * @param projectId - The RevenueCat project ID
   */
  constructor(apiKey: string, projectId: string) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Fetches customer data from the RevenueCat API
   * @param userId - The RevenueCat app user ID
   * @returns The customer data from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async getCustomer(userId: string): Promise<CustomerData> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: CustomerData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to fetch customer data: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Fetches active entitlements for a customer from the RevenueCat API
   * @param userId - The RevenueCat app user ID
   * @returns The entitlements data from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async getEntitlements(userId: string): Promise<ActiveEntitlementsResponse> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}/active_entitlements`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: ActiveEntitlementsResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to fetch entitlements: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Fetches entitlement details by ID from the RevenueCat API
   * @param entitlementId - The entitlement ID
   * @returns The entitlement details from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async getEntitlement(entitlementId: string): Promise<EntitlementData> {
    const url = `${this.baseUrl}/projects/${this.projectId}/entitlements/${encodeURIComponent(entitlementId)}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: EntitlementData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to fetch entitlement details: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Fetches virtual currency balances for a customer from the RevenueCat API
   * @param userId - The RevenueCat app user ID
   * @returns The virtual currency balances from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async getVirtualCurrencies(
    userId: string,
  ): Promise<VirtualCurrenciesBalancesResponse> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}/virtual_currencies`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: VirtualCurrenciesBalancesResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to fetch virtual currencies: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Updates virtual currency balance for a customer
   * @param userId - The RevenueCat app user ID
   * @param adjustments - Object with currency codes as keys and adjustment amounts as values
   * @param reference - Optional reference for the transaction
   * @returns The updated virtual currency balances from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async updateVirtualCurrencyBalance(
    userId: string,
    adjustments: Record<string, number>,
    reference?: string,
  ): Promise<VirtualCurrenciesBalancesResponse> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}/virtual_currencies/update_balance`;

    try {
      const body: { adjustments: Record<string, number>; reference?: string } =
        { adjustments };
      if (reference) {
        body.reference = reference;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: VirtualCurrenciesBalancesResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to update virtual currency balance: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Fetches all entitlements for a project from the RevenueCat API
   * @returns The entitlements list from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async listEntitlements(): Promise<ListEntitlementsResponse> {
    const url = `${this.baseUrl}/projects/${this.projectId}/entitlements`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: ListEntitlementsResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to list entitlements: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Grants an entitlement to a customer
   * @param userId - The RevenueCat app user ID
   * @param entitlementId - The entitlement ID to grant
   * @param expiresAtMs - Expiration time in milliseconds since epoch
   * @returns The updated customer data from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async grantEntitlement(
    userId: string,
    entitlementId: string,
    expiresAtMs: number,
  ): Promise<CustomerData> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}/actions/grant_entitlement`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entitlement_id: entitlementId,
          expires_at: expiresAtMs,
        }),
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: CustomerData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to grant entitlement: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Revokes a granted entitlement from a customer
   * @param userId - The RevenueCat app user ID
   * @param entitlementId - The entitlement ID to revoke
   * @returns The updated customer data from the API
   * @throws {RevenueCatAPIError} If the API request fails
   */
  async revokeEntitlement(
    userId: string,
    entitlementId: string,
  ): Promise<CustomerData> {
    const url = `${this.baseUrl}/projects/${this.projectId}/customers/${encodeURIComponent(userId)}/actions/revoke_granted_entitlement`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entitlement_id: entitlementId,
        }),
      });

      if (!response.ok) {
        throw new RevenueCatAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }

      const data: CustomerData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof RevenueCatAPIError) {
        throw error;
      }

      throw new RevenueCatAPIError(
        `Failed to revoke entitlement: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
