# SlipstreamSDK

The main SDK class that provides access to all Slipstream functionality.

## Constructor

```typescript
new SlipstreamSDK(config: SlipstreamSDKConfig)
```

### Parameters

- `config` - Configuration object for the SDK

### SlipstreamSDKConfig

```typescript
interface SlipstreamSDKConfig {
  timeout?: number; // Request timeout in milliseconds (default: 30000)
}
```

## Methods

### Health Endpoints

#### ping()

Basic health check for the Slipstream service.

```typescript
async ping(): Promise<HealthResponse>
```

**Returns:** [`HealthResponse`](/api/types#healthresponse)

**Example:**
```typescript
const health = await sdk.ping();
console.log(health.message); // "Slipstream Proxy is running"
```

#### pingRelayer()

Detailed health check for the relayer service with supported chains information.

```typescript
async pingRelayer(): Promise<RelayerHealthResponse>
```

**Returns:** [`RelayerHealthResponse`](/api/types#relayerhealthresponse)

**Example:**
```typescript
const relayerHealth = await sdk.pingRelayer();
console.log('Uptime:', relayerHealth.uptime);
console.log('Supported chains:', relayerHealth.supportedChains);
```

### Transaction Endpoints

#### relayTransaction()

Submit a gasless transaction for relay.

```typescript
async relayTransaction(body: RelayRequest): Promise<RelayerHealthResponse>
```

**Parameters:**
- `body` - The relay request containing transaction details and signature

**Returns:** [`RelayerHealthResponse`](/api/types#relayerhealthresponse)

**Example:**
```typescript
const relayRequest: RelayRequest = {
  chainId: 84532,
  request: {
    fromAddress: '0x123...',
    toAddress: '0x456...',
    tokenContract: '0x789...',
    transferAmount: '1000000',
    relayerServiceFee: '10000',
    transactionNonce: '1',
    expirationDeadline: '1234567890'
  },
  signature: '0xabc...'
};

const result = await sdk.relayTransaction(relayRequest);
```

#### getTransactionStatus()

Get the current status of a relayed transaction.

```typescript
async getTransactionStatus(transactionHash: string): Promise<TransactionStatus>
```

**Parameters:**
- `transactionHash` - The hash of the transaction to check

**Returns:** [`TransactionStatus`](/api/types#transactionstatus)

**Example:**
```typescript
const status = await sdk.getTransactionStatus('0xabc123...');
console.log(`Status: ${status.status}`);
console.log(`Confirmations: ${status.confirmations}`);
```

### Fee and Info Endpoints

#### getFeeEstimate()

Get fee estimation for a transaction.

```typescript
async getFeeEstimate(params: {
  chainId: string;
  tokenSymbol: string;
  amount: string;
}): Promise<FeeEstimateResponse>
```

**Parameters:**
- `chainId` - The chain ID as a string
- `tokenSymbol` - Symbol of the token (e.g., 'USDC')
- `amount` - Amount to transfer

**Returns:** [`FeeEstimateResponse`](/api/types#feeestimateresponse)

**Example:**
```typescript
const fee = await sdk.getFeeEstimate({
  chainId: '84532',
  tokenSymbol: 'USDC',
  amount: '100'
});
console.log(`Fee: ${fee.fee} (${fee.feeUsd} USD)`);
```

#### getRelayerInfo()

Get information about the relayer including supported chains and balances.

```typescript
async getRelayerInfo(): Promise<RelayerInfoResponse>
```

**Returns:** [`RelayerInfoResponse`](/api/types#relayerinforesponse)

**Example:**
```typescript
const info = await sdk.getRelayerInfo();
console.log('Relayer address:', info.relayerAddress);
console.log('Supported chains:', info.supportedChains);
console.log('Balances:', info.balances);
```

#### getSafetyLimits()

Get safety limits and fee settings for a specific chain.

```typescript
async getSafetyLimits(chainId: string): Promise<SafetyLimitsResponse>
```

**Parameters:**
- `chainId` - The chain ID as a string

**Returns:** [`SafetyLimitsResponse`](/api/types#safetylimitsresponse)

**Example:**
```typescript
const limits = await sdk.getSafetyLimits('84532');
console.log('Fee settings:', limits.feeSettings);
```

#### getNetworkStatus()

Get network status for a specific chain.

```typescript
async getNetworkStatus(chainId: string): Promise<NetworkStatusResponse>
```

**Parameters:**
- `chainId` - The chain ID as a string

**Returns:** [`NetworkStatusResponse`](/api/types#networkstatusresponse)

**Example:**
```typescript
const status = await sdk.getNetworkStatus('84532');
console.log('Network status:', status.status);
console.log('Relayer balance:', status.relayerBalance);
```