# Types Reference

## Core Types

### ChainId

Supported chain IDs for the Slipstream SDK.

```typescript
type ChainId = 5920 | 84532 | 421614;
```

- `5920` - Kadena
- `84532` - Base Sepolia  
- `421614` - Arbitrum Sepolia

## Health Types

### HealthResponse

Basic health check response.

```typescript
type HealthResponse = {
  message: string;
  timestamp: string;
  version: string;
}
```

### RelayerHealthResponse

Detailed relayer health check response with supported chains.

```typescript
type RelayerHealthResponse = {
  message: string;
  timestamp: string;
  uptime: string;
  version: string;
  supportedChains: SupportedChains[];
}
```

### SupportedChains

Information about a supported blockchain network.

```typescript
type SupportedChains = {
  id: string;
  name: string;
  tokens: string[];
}
```

## Transaction Types

### RelayRequest

Complete relay request structure for submitting gasless transactions.

```typescript
interface RelayRequest {
  chainId: ChainId;
  request: GaslessTransactionRequest;
  permit?: PermitSignature; // Optional permit signature
  signature: string;
}
```

### GaslessTransactionRequest

Core transaction request details.

```typescript
interface GaslessTransactionRequest {
  fromAddress: string;
  toAddress: string;
  tokenContract: string;
  transferAmount: string; // Amount in token's smallest unit
  relayerServiceFee: string; // Fee in token's smallest unit
  transactionNonce: string;
  expirationDeadline: string; // Unix timestamp
}
```

### PermitSignature

EIP-2612 permit signature for token approval (optional).

```typescript
interface PermitSignature {
  approvalValue: string;
  permitDeadline: string;
  signatureV: number;
  signatureR: string;
  signatureS: string;
}
```

### TransactionStatus

Status information for a relayed transaction.

```typescript
type TransactionStatus = {
  success: boolean;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number; // Available when confirmed
  gasUsed?: string; // Available when confirmed
  effectiveGasPrice?: string; // Available when confirmed
  timestamp: Date;
}
```

## Relayer Info Types

### RelayerInfoResponse

Comprehensive relayer information including supported chains and balances.

```typescript
type RelayerInfoResponse = {
  success: boolean;
  relayerAddress: string;
  supportedChains: {
    id: number;
    name: string;
    explorerUrl: string;
    tokens: {
      symbol: string;
      address: string;
      decimals: number;
      name: string;
    }[];
  }[];
  balances: {
    chainId: number;
    chainName: string;
    balance: string;
    currency: string;
  }[];
}
```

### SafetyLimitsResponse

Safety limits and fee configuration for a specific chain.

```typescript
type SafetyLimitsResponse = {
  success: boolean;
  chainId: number;
  chainName: string;
  feeSettings: {
    baseFeeBps: number; // Base fee in basis points
    minFeeUsd: number; // Minimum fee in USD
    maxFeeBps: number; // Maximum fee in basis points
  };
  message: string;
}
```

### NetworkStatusResponse

Network status information for a specific chain.

```typescript
type NetworkStatusResponse = {
  success: true;
  chainId: number;
  chainName: string;
  relayerBalance: string;
  relayerAddress: string;
  gaslessContract: string;
  status: string;
}
```

## Fee Types

### FeeEstimateResponse

Fee estimation response with both token amount and USD value.

```typescript
type FeeEstimateResponse = {
  success: boolean;
  fee: string; // Fee amount in token's smallest unit
  feeUsd: string; // Fee amount in USD
  message?: string; // Optional error or info message
}
```

## Configuration Types

### SlipstreamSDKConfig

Configuration options for initializing the SDK.

```typescript
interface SlipstreamSDKConfig {
  timeout?: number; // Request timeout in milliseconds (default: 30000)
}
```