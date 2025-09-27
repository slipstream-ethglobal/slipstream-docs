# Examples

## Basic Setup

```typescript
import { SlipstreamSDK } from 'slipstream-sdk';

const sdk = new SlipstreamSDK({
  timeout: 30000 // 30 seconds
});
```

## Health Monitoring

### Simple Health Check

```typescript
async function checkHealth() {
  try {
    const health = await sdk.ping();
    console.log('Service is healthy:', health.message);
    console.log('Version:', health.version);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}
```

### Detailed Relayer Status

```typescript
async function checkRelayerStatus() {
  try {
    const status = await sdk.pingRelayer();
    console.log('Relayer uptime:', status.uptime);
    console.log('Supported chains:');
    
    status.supportedChains.forEach(chain => {
      console.log(`- ${chain.name} (ID: ${chain.id})`);
      console.log(`  Tokens: ${chain.tokens.join(', ')}`);
    });
  } catch (error) {
    console.error('Relayer status check failed:', error);
  }
}
```

## Fee Estimation

### Get Fee for USDC Transfer

```typescript
async function estimateUSDCFee() {
  try {
    const feeEstimate = await sdk.getFeeEstimate({
      chainId: '84532', // Base Sepolia
      tokenSymbol: 'USDC',
      amount: '100' // $100 USDC
    });
    
    if (feeEstimate.success) {
      console.log(`Fee: ${feeEstimate.fee} USDC`);
      console.log(`Fee in USD: $${feeEstimate.feeUsd}`);
    } else {
      console.log('Fee estimation failed:', feeEstimate.message);
    }
  } catch (error) {
    console.error('Fee estimation error:', error);
  }
}
```

### Compare Fees Across Chains

```typescript
async function compareFees() {
  const chains = ['84532', '421614']; // Base, Arbitrum
  const amount = '50';
  const token = 'USDC';
  
  for (const chainId of chains) {
    try {
      const fee = await sdk.getFeeEstimate({
        chainId,
        tokenSymbol: token,
        amount
      });
      
      console.log(`Chain ${chainId}: ${fee.feeUsd} USD`);
    } catch (error) {
      console.log(`Chain ${chainId}: Error - ${error.message}`);
    }
  }
}
```

## Relayer Information

### Get Supported Tokens

```typescript
async function getSupportedTokens() {
  try {
    const info = await sdk.getRelayerInfo();
    
    console.log('Relayer Address:', info.relayerAddress);
    console.log('\nSupported Chains and Tokens:');
    
    info.supportedChains.forEach(chain => {
      console.log(`\n${chain.name} (${chain.id}):`);
      console.log(`Explorer: ${chain.explorerUrl}`);
      
      chain.tokens.forEach(token => {
        console.log(`  - ${token.name} (${token.symbol})`);
        console.log(`    Address: ${token.address}`);
        console.log(`    Decimals: ${token.decimals}`);
      });
    });
  } catch (error) {
    console.error('Failed to get relayer info:', error);
  }
}
```

### Check Relayer Balances

```typescript
async function checkRelayerBalances() {
  try {
    const info = await sdk.getRelayerInfo();
    
    console.log('Relayer Balances:');
    info.balances.forEach(balance => {
      console.log(`${balance.chainName}: ${balance.balance} ${balance.currency}`);
    });
  } catch (error) {
    console.error('Failed to get balances:', error);
  }
}
```

## Transaction Relay

### Complete Transaction Flow

```typescript
import { RelayRequest, ChainId } from 'slipstream-sdk';

async function relayTransaction() {
  // Step 1: Prepare the relay request
  const relayRequest: RelayRequest = {
    chainId: 84532 as ChainId, // Base Sepolia
    request: {
      fromAddress: '0x1234567890123456789012345678901234567890',
      toAddress: '0x0987654321098765432109876543210987654321',
      tokenContract: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
      transferAmount: '1000000', // 1 USDC (6 decimals)
      relayerServiceFee: '10000', // 0.01 USDC fee
      transactionNonce: '1',
      expirationDeadline: Math.floor(Date.now() / 1000 + 3600).toString() // 1 hour from now
    },
    signature: '0xabcdef...' // Transaction signature from user's wallet
  };
  
  try {
    // Step 2: Submit the transaction
    console.log('Submitting transaction for relay...');
    const result = await sdk.relayTransaction(relayRequest);
    console.log('Transaction submitted successfully');
    
    // Step 3: Monitor transaction status (if transaction hash is available)
    // Note: The actual transaction hash would be returned in a real implementation
    // This is a placeholder for demonstration
    const txHash = '0x...'; // Would come from the relay result
    
    if (txHash) {
      await monitorTransaction(txHash);
    }
    
  } catch (error) {
    console.error('Transaction relay failed:', error);
  }
}
```

### Transaction Status Monitoring

```typescript
async function monitorTransaction(txHash: string) {
  const maxAttempts = 30; // Maximum polling attempts
  const pollInterval = 5000; // 5 seconds between polls
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await sdk.getTransactionStatus(txHash);
      
      console.log(`Attempt ${attempt}: Status = ${status.status}`);
      console.log(`Confirmations: ${status.confirmations}`);
      
      if (status.status === 'confirmed') {
        console.log('✅ Transaction confirmed!');
        console.log(`Block Number: ${status.blockNumber}`);
        console.log(`Gas Used: ${status.gasUsed}`);
        console.log(`Effective Gas Price: ${status.effectiveGasPrice}`);
        break;
      } else if (status.status === 'failed') {
        console.log('❌ Transaction failed');
        break;
      }
      
      // Wait before next poll
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
    } catch (error) {
      console.error(`Status check attempt ${attempt} failed:`, error);
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
  }
}
```

## Network Information

### Check Network Status

```typescript
async function checkNetworkStatus(chainId: string) {
  try {
    const status = await sdk.getNetworkStatus(chainId);
    
    console.log(`Network Status for ${status.chainName}:`);
    console.log(`Status: ${status.status}`);
    console.log(`Relayer Address: ${status.relayerAddress}`);
    console.log(`Relayer Balance: ${status.relayerBalance}`);
    console.log(`Gasless Contract: ${status.gaslessContract}`);
  } catch (error) {
    console.error(`Failed to get network status for chain ${chainId}:`, error);
  }
}
```

### Get Safety Limits

```typescript
async function checkSafetyLimits(chainId: string) {
  try {
    const limits = await sdk.getSafetyLimits(chainId);
    
    console.log(`Safety Limits for ${limits.chainName}:`);
    console.log(`Base Fee: ${limits.feeSettings.baseFeeBps} bps`);
    console.log(`Min Fee USD: $${limits.feeSettings.minFeeUsd}`);
    console.log(`Max Fee: ${limits.feeSettings.maxFeeBps} bps`);
    console.log(`Message: ${limits.message}`);
  } catch (error) {
    console.error(`Failed to get safety limits for chain ${chainId}:`, error);
  }
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
async function robustSDKUsage() {
  try {
    // Always check health first
    await sdk.ping();
    
    // Get fee estimate with error handling
    const feeEstimate = await sdk.getFeeEstimate({
      chainId: '84532',
      tokenSymbol: 'USDC',
      amount: '100'
    });
    
    if (!feeEstimate.success) {
      throw new Error(feeEstimate.message || 'Fee estimation failed');
    }
    
    console.log('Fee estimate successful:', feeEstimate);
    
  } catch (error) {
    if (error.response) {
      // HTTP error response
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
  }
}
```

## Utility Functions

### Chain ID Helper

```typescript
function getChainName(chainId: ChainId): string {
  const chainNames = {
    5920: 'Kadena',
    84532: 'Base Sepolia',
    421614: 'Arbitrum Sepolia'
  };
  
  return chainNames[chainId] || 'Unknown Chain';
}
```

### Amount Formatting

```typescript
function formatTokenAmount(amount: string, decimals: number): string {
  const divisor = Math.pow(10, decimals);
  const formatted = (parseInt(amount) / divisor).toFixed(decimals);
  return parseFloat(formatted).toString(); // Remove trailing zeros
}

// Example usage
const usdcAmount = formatTokenAmount('1000000', 6); // "1" (1 USDC)
const ethAmount = formatTokenAmount('1000000000000000000', 18); // "1" (1 ETH)
```