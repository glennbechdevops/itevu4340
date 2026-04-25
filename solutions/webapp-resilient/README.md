# Resilient Webapp Solution

This is a reference implementation of the Chaos Coffee webapp with resilience patterns applied.

## Resilience Patterns Implemented

### 1. Request Timeout (5 seconds)

**Problem:** Requests can hang indefinitely, poor UX

**Solution:**
```javascript
async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}
```

**Benefits:**
- Fail fast instead of hanging
- Users get feedback quickly
- Prevents browser from blocking

### 2. Retry with Exponential Backoff

**Problem:** Transient failures cause immediate failure

**Solution:**
```javascript
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) throw error;

            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
```

**Retry Schedule:**
- Attempt 1: Immediate
- Attempt 2: Wait 1000ms
- Attempt 3: Wait 2000ms
- Attempt 4: Wait 4000ms

**Benefits:**
- Handles transient network failures
- Gives backend time to recover
- Exponential backoff prevents thundering herd

### 3. Circuit Breaker

**Problem:** Repeated failures waste resources and degrade UX

**Solution:**
```javascript
class CircuitBreaker {
    constructor(threshold = 3, timeout = 60000) {
        this.failureCount = 0;
        this.threshold = threshold;
        this.timeout = timeout;
        this.state = 'CLOSED';
        this.nextAttempt = Date.now();
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                throw new Error('Service temporarily unavailable');
            }
            this.state = 'HALF_OPEN';
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failureCount++;
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
        }
    }
}
```

**States:**
- **CLOSED:** Normal operation, requests pass through
- **OPEN:** Too many failures, reject requests immediately
- **HALF_OPEN:** Testing if service recovered

**Benefits:**
- Prevents cascading failures
- Gives backend time to recover
- Fast failure when service is down
- Automatic recovery testing

### 4. Loading States

**Problem:** Users don't know request is in progress

**Solution:**
```javascript
checkoutBtn.disabled = true;
checkoutBtn.classList.add('loading');
checkoutBtn.textContent = 'Processing...';
showStatus('Submitting order...', 'loading');
```

**Benefits:**
- Clear feedback to users
- Prevents duplicate clicks
- Better UX during slow requests

### 5. Error Messages

**Problem:** Silent failures, users confused

**Solution:**
```javascript
catch (error) {
    let errorMessage = 'Order failed. Please try again.';

    if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Check connection.';
    } else if (error.message.includes('temporarily unavailable')) {
        errorMessage = error.message;  // Circuit breaker message
    }

    showStatus(errorMessage, 'error');
}
```

**Benefits:**
- Users know what went wrong
- Actionable error messages
- Different messages for different failure modes

### 6. Optimistic Rollback

**Problem:** Cart state inconsistent on failure

**Solution:**
```javascript
const originalCart = [...cart];

try {
    // Submit order
    cart = [];  // Optimistically clear
} catch (error) {
    cart = originalCart;  // Rollback on failure
    updateCart();
}
```

**Benefits:**
- Consistent state
- No data loss on failures
- Can optimistically update UI in future enhancements

## Comparison: Before vs After

### Scenario: 2000ms latency added by ToxiProxy

**Before (Fragile):**
- User clicks checkout
- No feedback for 2 seconds
- User clicks again (duplicate order)
- No error handling
- Confusing UX

**After (Resilient):**
- User clicks checkout
- Button disabled, shows "Processing..."
- Status message: "Submitting order..."
- Request completes (or times out)
- Clear success or error message
- Cart state consistent

### Scenario: Lambda is down (500 errors)

**Before (Fragile):**
- Request fails silently
- No error message
- Cart still shows items
- User confused

**After (Resilient):**
- Attempt 1: Fails, retry after 1s
- Attempt 2: Fails, retry after 2s
- Attempt 3: Fails, show error
- After 3 failures: Circuit opens
- Next requests: Immediate "Service temporarily unavailable"
- After 60s: Circuit tries again (half-open)

## Testing the Resilient Version

### 1. Normal Operation

Without ToxiProxy:
- Checkout should work normally
- Fast responses
- Circuit breaker stays CLOSED

### 2. High Latency (2000ms)

With ToxiProxy latency toxic:
- Checkout takes ~2 seconds
- Loading state shown
- Success after delay
- Circuit breaker stays CLOSED (not failing)

### 3. Timeouts

With ToxiProxy timeout toxic (8000ms):
- Request times out after 5 seconds
- Retry logic kicks in
- After 3 attempts (5s each), fails
- Clear error message
- Circuit breaker opens after 3 failures

### 4. Intermittent Failures

Alternate between working and failing:
- Some requests succeed
- Some fail and retry
- Circuit breaker adapts
- Successful requests reset failure count

## How to Use This Solution

### Option 1: Compare with Your Implementation

Use this as a reference when building your own resilient version:

1. Read the patterns above
2. Implement each pattern in your webapp
3. Compare your code with this solution
4. Test under chaos

### Option 2: Replace Webapp Code

Copy `app-resilient.js` to `webapp/app.js`:

```bash
cp solutions/webapp-resilient/app-resilient.js webapp/app.js
```

Update Lambda URL in the file, then test with ToxiProxy.

## Key Learnings

1. **Timeouts are essential** - Always fail fast
2. **Retry transient failures** - Network hiccups happen
3. **Circuit breakers prevent cascades** - Don't keep trying when service is down
4. **UX matters** - Show loading states and clear errors
5. **State management** - Keep cart consistent on failures
6. **Logging helps** - Console logs show what's happening

## Advanced Enhancements (Optional)

### Request Deduplication

Add idempotency keys to prevent duplicate orders:

```javascript
const requestId = uuid();
headers['X-Request-ID'] = requestId;
```

Lambda checks if request ID already processed.

### Offline Support

Use Service Workers to queue requests when offline:

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

### Metrics and Monitoring

Track failure rates, retry counts, circuit breaker state:

```javascript
const metrics = {
    requests: 0,
    failures: 0,
    retries: 0,
    circuitBreakerOpens: 0
};
```

Send to analytics service.

### Progressive Enhancement

Start with basic resilience, add more under stress:

1. Basic: Timeout + error messages
2. Intermediate: Retry + loading states
3. Advanced: Circuit breaker + metrics
4. Expert: Adaptive timeouts, bulkheads, fallbacks

## Further Reading

- [Resilience4j Patterns](https://resilience4j.readme.io/docs)
- [AWS Lambda Error Handling](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Exponential Backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
