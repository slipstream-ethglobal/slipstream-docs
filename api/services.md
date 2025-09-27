# Services Reference

The Slipstream SDK includes internal service classes that handle HTTP communication and API interactions. While these are primarily used internally, they are exported for advanced use cases.

## HttpClientService

Low-level HTTP client service for making requests to the Slipstream API.

### Constructor

```typescript
new HttpClientService(timeout?: number)
```

**Parameters:**
- `timeout` - Request timeout in milliseconds (default: 30000)

### Configuration

- **Base URL**: `https://slipstream-proxy.onrender.com`
- **Default Headers**: `Content-Type: application/json`
- **Default Timeout**: 30 seconds

### Methods

#### get()

Make a GET request.

```typescript
async get<T>(url: string): Promise<T>
```

#### post()

Make a POST request.

```typescript
async post<T>(url: string, data: any): Promise<T>
```

#### put()

Make a PUT request.

```typescript
async put<T>(url: string, data: any): Promise<T>
```

#### delete()

Make a DELETE request.

```typescript
async delete<T>(url: string): Promise<T>
```

## SlipstreamService

High-level service that implements all Slipstream API endpoints. This service is used internally by the `SlipstreamSDK` class.

### Constructor

```typescript
new SlipstreamService(timeout?: number)
```

**Parameters:**
- `timeout` - Request timeout in milliseconds (default: 30000)

### Methods

All methods in `SlipstreamService` correspond directly to the methods available in [`SlipstreamSDK`](/api/slipstream-sdk), but provide direct access to the service layer.

#### Health Endpoints

- `ping()` - Basic health check
- `newRelayerPing()` - Detailed relayer health check

#### Transaction Endpoints

- `relayTransaction(body: RelayRequest)` - Submit transaction for relay
- `getTransactionStatus(transactionHash: string)` - Get transaction status

#### Fee and Info Endpoints

- `getFeeEstimate(params)` - Get fee estimation
- `getRelayerInfo()` - Get relayer information
- `getSafetyLimits(chainId: string)` - Get safety limits
- `getNetworkStatus(chainId: string)` - Get network status

### Error Handling

The service includes built-in error handling that:
- Logs errors with context information
- Re-throws errors for upstream handling
- Provides meaningful error messages for debugging

```typescript
private handleError(error: any, context: string): never {
  console.error(`Failed to ${context}:`, error?.message || error);
  throw error;
}
```

## Usage Example

While you typically use the `SlipstreamSDK` class, you can use services directly for advanced scenarios:

```typescript
import { SlipstreamService, HttpClientService } from 'slipstream-sdk';

// Direct service usage
const service = new SlipstreamService(60000); // 60 second timeout
const health = await service.ping();

// Direct HTTP client usage (advanced)
const httpClient = new HttpClientService(30000);
const customResponse = await httpClient.get('/custom-endpoint');
```

::: warning
Direct service usage bypasses the SDK's convenience methods and error handling. Use the main `SlipstreamSDK` class unless you have specific requirements that need direct service access.
:::