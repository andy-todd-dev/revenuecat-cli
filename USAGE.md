# RevenueCat CLI Usage Guide

## Overview

The RevenueCat CLI (`revcat`) is a command-line utility for interacting with the RevenueCat V2 API. It provides commands to manage customers, entitlements, and virtual currencies.

## Installation

```bash
npm install -g revenuecat-cli
```

## Configuration

All commands require two pieces of configuration:

1. **API Key** - Your RevenueCat API key
2. **Project ID** - Your RevenueCat project ID

These can be provided in two ways:

### Option 1: Environment Variables (Recommended)

```bash
export REVENUECAT_API_KEY="your-api-key"
export REVENUECAT_PROJECT_ID="your-project-id"
```

### Option 2: Command-Line Flags

```bash
revcat <command> -k your-api-key -p your-project-id
```

## Commands

### Customers

#### Get Customer Data

Fetch customer information from the RevenueCat API.

```bash
revcat customers get <userId>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)

**Examples:**

```bash
# Get customer data for user123
revcat customers get user123

# Get customer data for anonymous user
revcat customers get '$RCAnonymousID:abc123'
```

---

### Entitlements

#### Get Entitlements

Fetch active entitlements for a specific customer, or list all entitlements in the project.

```bash
revcat entitlements get [userId]
```

**Arguments:**

- `userId` - RevenueCat app user ID (optional - if omitted, lists all entitlements in the project)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)

**Examples:**

```bash
# Get active entitlements for a specific user
revcat entitlements get user123

# Get active entitlements for anonymous user
revcat entitlements get '$RCAnonymousID:abc123'

# List all entitlements in the project
revcat entitlements get
```

#### Add Entitlement

Grant an entitlement to a customer with an expiration time.

```bash
revcat entitlements add <userId> <entitlementId> <expiration>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)
- `entitlementId` - Entitlement ID to grant (required)
- `expiration` - Expiration time (required)

**Expiration Format:**

The expiration can be specified using multiple formats:

- **Duration**: `7d`, `2h`, `1w`, `30m`, `1M`, `1y`
  - `m` = minutes
  - `h` = hours
  - `d` = days
  - `w` = weeks
  - `M` = months (30 days)
  - `y` = years (365 days)
- **ISO 8601 Date**: `2026-02-15T14:30:00Z`
- **Never**: `never` (sets expiration 100 years in the future)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)

**Examples:**

```bash
# Grant entitlement that expires in 7 days
revcat entitlements add user123 entla1b2c3d4e5 7d

# Grant entitlement that expires in 2 hours
revcat entitlements add user123 entla1b2c3d4e5 2h

# Grant entitlement with specific expiration date
revcat entitlements add user123 entla1b2c3d4e5 2026-02-15T14:30:00Z

# Grant entitlement that never expires
revcat entitlements add user123 entla1b2c3d4e5 never
```

#### Delete Entitlement

Revoke a granted entitlement from a customer.

```bash
revcat entitlements del <userId> <entitlementId>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)
- `entitlementId` - Entitlement ID to revoke (required)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)

**Examples:**

```bash
# Revoke an entitlement from a user
revcat entitlements del user123 entla1b2c3d4e5
```

---

### Virtual Currencies

#### Get Virtual Currency Balances

Fetch virtual currency balances for a customer.

```bash
revcat virtualcurrencies get <userId>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)

**Examples:**

```bash
# Get virtual currency balances for user123
revcat virtualcurrencies get user123

# Get virtual currency balances for anonymous user
revcat virtualcurrencies get '$RCAnonymousID:abc123'
```

#### Add Virtual Currency

Add or subtract virtual currency balance for a customer.

```bash
revcat virtualcurrencies add <userId> <currencyCode> <amount>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)
- `currencyCode` - Virtual currency code (required)
- `amount` - Amount to add (use negative value to subtract) (required)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)
- `-r, --reference` - Optional reference for the transaction

**Examples:**

```bash
# Add 100 gems to user's balance
revcat virtualcurrencies add user123 gems 100

# Subtract 50 coins from anonymous user's balance
revcat virtualcurrencies add '$RCAnonymousID:abc123' coins -50

# Add with transaction reference
revcat virtualcurrencies add user123 gems 100 -r "daily_reward"
```

#### Delete Virtual Currency

Subtract virtual currency balance from a customer.

```bash
revcat virtualcurrencies del <userId> <currencyCode> <amount>
```

**Arguments:**

- `userId` - RevenueCat app user ID (required)
- `currencyCode` - Virtual currency code (required)
- `amount` - Amount to subtract (required)

**Flags:**

- `-k, --apiKey` - RevenueCat API key (or set `REVENUECAT_API_KEY`)
- `-p, --projectId` - RevenueCat project ID (or set `REVENUECAT_PROJECT_ID`)
- `-r, --reference` - Optional reference for the transaction

**Examples:**

```bash
# Subtract 50 gems from user's balance
revcat virtualcurrencies del user123 gems 50

# Subtract 100 coins from anonymous user's balance
revcat virtualcurrencies del '$RCAnonymousID:abc123' coins 100

# Subtract with transaction reference
revcat virtualcurrencies del user123 gems 50 -r "item_purchase"
```

---

## Common Use Cases

### Daily Workflow with Environment Variables

```bash
# Set credentials once
export REVENUECAT_API_KEY="sk_test_..."
export REVENUECAT_PROJECT_ID="proj_..."

# Now use commands without flags
revcat customers get user123
revcat entitlements get user123
revcat virtualcurrencies get user123
```

### Testing Entitlements

```bash
# Grant a test entitlement for 1 hour
revcat entitlements add test_user entl_premium 1h

# Check active entitlements
revcat entitlements get test_user

# Revoke when done testing
revcat entitlements del test_user entl_premium
```

### Managing Virtual Currency

```bash
# Check current balance
revcat virtualcurrencies get user123

# Award daily reward
revcat virtualcurrencies add user123 gems 50 -r "daily_login"

# Process in-game purchase
revcat virtualcurrencies del user123 gems 100 -r "sword_purchase"

# Check updated balance
revcat virtualcurrencies get user123
```

### Working with Anonymous Users

```bash
# Anonymous user IDs start with $RCAnonymousID:
revcat customers get '$RCAnonymousID:abc123def456'
revcat entitlements add '$RCAnonymousID:abc123def456' entl_premium 7d
```

---

## Error Handling

The CLI will exit with code 1 and display an error message if:

- Required arguments are missing
- API credentials are invalid
- Network requests fail
- Invalid data format is provided

Errors are displayed in a user-friendly format with helpful context.

---

## Getting Help

For help with any command, use the `--help` flag:

```bash
revcat --help
revcat customers --help
revcat entitlements add --help
```

---

## License

This project is licensed under the GPL-3.0-only License.

## Author

Andrew Todd

## Repository

https://github.com/andy-todd-dev/revenuecat-cli
