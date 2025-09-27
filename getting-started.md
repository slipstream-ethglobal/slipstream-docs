# Getting Started

## Installation

Install the Slipstream SDK using your preferred package manager:

::: code-group

```bash [npm]
npm install slipstream-sdk
```

```bash [yarn]
yarn add slipstream-sdk
```

```bash [pnpm]
pnpm add slipstream-sdk
```

```bash [bun]
bun add slipstream-sdk
```

:::

## Quick Start

```typescript
import { SlipstreamSDK } from 'slipstream-sdk';

// Initialize the SDK
const sdk = new SlipstreamSDK({
  timeout: 30000 // Optional: request timeout in milliseconds
});

// Check if the service is healthy
const health = await sdk.ping();
console.log(health);

// Get relayer information
const relayerInfo = await sdk.getRelayerInfo();
console.log('Supported chains:', relayerInfo.supportedChains);
```

## Basic Usage

### 1. Health Checks

```typescript
// Basic health check
const health = await sdk.ping();

// Detailed relayer health check
const relayerHealth = await sdk.pingRelayer();
console.log('Supported chains:', relayerHealth.supportedChains);
```

### 2. Fee Estimation

```typescript
const feeEstimate = await sdk.getFeeEstimate({
  chainId: '84532', // Base Sepolia
  tokenSymbol: 'USDC',
  amount: '100'
});

console.log(`Fee: ${feeEstimate.fee} (${feeEstimate.feeUsd} USD)`);
```

### 3. Transaction Relay

```typescript
import { RelayRequest, ChainId } from 'slipstream-sdk';

const relayRequest: RelayRequest = {
  chainId: 84532 as ChainId, // Base Sepolia
  request: {
    fromAddress: '0x...',
    toAddress: '0x...',
    tokenContract: '0x...',
    transferAmount: '1000000', // Amount in token's smallest unit
    relayerServiceFee: '10000',
    transactionNonce: '1',
    expirationDeadline: '1234567890'
  },
  signature: '0x...' // Transaction signature
};

const result = await sdk.relayTransaction(relayRequest);
console.log('Transaction relayed:', result);
```

### 4. Transaction Status

```typescript
const status = await sdk.getTransactionStatus('0x...');
console.log(`Status: ${status.status}, Confirmations: ${status.confirmations}`);
```

## Supported Networks

The SDK supports the following networks:

- **Kadena**: Chain ID `5920`
- **Base Sepolia**: Chain ID `84532`  
- **Arbitrum Sepolia**: Chain ID `421614`

## Next Steps

- [API Reference](/api/slipstream-sdk) - Complete API documentation
- [Types Reference](/api/types) - TypeScript type definitions
- [Examples](/examples) - More detailed usage examples