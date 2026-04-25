# Chaos Coffee Web Application

A professional coffee bean e-commerce webapp built with React and Framer Motion for chaos engineering experiments.

## Features

- Modern React application with smooth animations
- Browse premium coffee beans from around the world
- Beautiful UI with Framer Motion animations
- Shopping cart with slide-in animations
- Checkout flow that sends orders to AWS Lambda
- **Intentionally fragile** - no error handling, retry logic, or resilience patterns (this is for teaching!)

## Tech Stack

- **React 18** - Modern UI library
- **Framer Motion** - Smooth animations
- **Vite** - Fast development and build tool
- **Vanilla CSS** - No frameworks, professional styling

## Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Header with cart button
│   │   ├── ProductCard.jsx    # Product display with animations
│   │   └── Cart.jsx           # Cart panel (fragile checkout!)
│   ├── data/
│   │   └── products.js        # Coffee product data
│   ├── App.jsx                # Main application
│   ├── App.css                # Styles
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   └── config.js              # Lambda URL configuration
├── index-new.html             # HTML entry point for Vite
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── docker-compose.yml         # ToxiProxy setup
├── toxiproxy-config.json      # Proxy configuration
└── README.md                  # This file
```

## Setup

### 1. Install Dependencies

```bash
cd webapp
npm install
```

### 2. Configure Lambda Function URL

After deploying infrastructure, update `src/config.js`:

```javascript
export const LAMBDA_URL = 'YOUR_LAMBDA_FUNCTION_URL_HERE';
```

Get the URL from Terraform output:

```bash
cd ../my-deployment
terraform output lambda_function_url
```

### 3. Run Development Server

```bash
npm run dev
```

This will start Vite dev server at http://localhost:3000 and open in your browser.

### 4. Build for Production (Optional)

```bash
npm run build
npm run preview
```

### 3. Test Basic Functionality

1. Browse the coffee products
2. Add items to cart
3. Click checkout
4. **Observe the CORS error in browser console**

This error is intentional - part of the chaos engineering exercise!

## Using ToxiProxy for Chaos Experiments

ToxiProxy sits between your webapp and the Lambda function to inject network failures.

### Start ToxiProxy

First, configure the upstream Lambda URL:

Edit `toxiproxy-config.json` and replace the placeholder:

```json
{
  "name": "chaos-proxy",
  "listen": "0.0.0.0:8000",
  "upstream": "https://your-actual-lambda-url.lambda-url.us-east-1.on.aws/"
}
```

Start the container:

```bash
docker-compose up -d
```

Verify it's running:

```bash
docker-compose ps
curl http://localhost:8474/version
```

### Configure Webapp to Use ToxiProxy

Update `app.js` to route requests through ToxiProxy:

```javascript
const LAMBDA_URL = 'http://localhost:8000';
```

**Note:** This still won't fix CORS - ToxiProxy just forwards the request. But now you can inject network chaos!

### Available Chaos Experiments

#### 1. Add Latency

Add 2000ms delay to all requests:

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "high-latency",
    "type": "latency",
    "attributes": {
      "latency": 2000,
      "jitter": 500
    }
  }'
```

**Observe:**
- How long does checkout take?
- Do users click multiple times?
- Are there duplicate orders in DynamoDB?

#### 2. Add Timeout

Close connections after 5 seconds:

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "timeout",
    "type": "timeout",
    "attributes": {
      "timeout": 5000
    }
  }'
```

**Observe:**
- How does the webapp handle timeouts?
- What error messages do users see?
- Is there any loading state?

#### 3. Limit Bandwidth

Simulate slow network (1 KB/s):

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "slow-connection",
    "type": "bandwidth",
    "attributes": {
      "rate": 1024
    }
  }'
```

**Observe:**
- How slow is the response?
- Does the UI freeze or remain responsive?

#### 4. Slice Data

Break data into small packets with delays:

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "packet-slicer",
    "type": "slicer",
    "attributes": {
      "average_size": 64,
      "size_variation": 32,
      "delay": 10
    }
  }'
```

**Observe:**
- Does this cause timeouts?
- How does slow packet delivery affect UX?

### List Active Toxics

```bash
curl http://localhost:8474/proxies/chaos-proxy/toxics
```

### Remove a Toxic

```bash
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/high-latency
```

### Remove All Toxics (Reset)

```bash
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/high-latency
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/timeout
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/slow-connection
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/packet-slicer
```

### Stop ToxiProxy

```bash
docker-compose down
```

## Architecture Flow

### Without ToxiProxy

```
[Browser] → [Lambda Function URL] → [Lambda] → [DynamoDB]
```

### With ToxiProxy

```
[Browser] → [ToxiProxy:8000] → [Lambda Function URL] → [Lambda] → [DynamoDB]
                ↑
            Inject chaos here
```

## Observing Failures

### Browser Developer Tools

1. Open DevTools (F12)
2. Go to **Console** tab
   - See CORS errors
   - See JavaScript exceptions
   - View request/response
3. Go to **Network** tab
   - See request timing
   - See failed requests
   - View HTTP status codes

### Lambda Logs

Watch Lambda execution in real-time:

```bash
aws logs tail /aws/lambda/chaos-coffee-<student-id> --follow
```

### DynamoDB

Check for duplicate orders:

```bash
aws dynamodb scan --table-name chaos-coffee-<student-id>
```

## Current Behavior (Before Resilience)

### No Error Handling
- Failed requests show no user feedback
- Users don't know if checkout worked
- No retry on transient failures

### No Timeout
- Requests can hang indefinitely
- No "fail fast" behavior
- Poor user experience

### No Loading State
- Button doesn't show "processing"
- Users click multiple times
- Duplicate orders created

### No Circuit Breaker
- Keeps trying even when Lambda is down
- Cascading failures
- Wasted resources

## Part 2: Adding Resilience

In Part 2 of the lab, you'll modify this webapp to add:

1. **Request Timeout** - Fail fast after 5 seconds
2. **Retry Logic** - Exponential backoff for transient failures
3. **Circuit Breaker** - Stop trying after repeated failures
4. **Loading States** - Show user what's happening
5. **Error Messages** - Clear feedback on failures
6. **Optimistic UI** - Update UI before confirming with server
7. **Request Deduplication** - Prevent duplicate orders

See `../solutions/webapp-resilient/` for reference implementations.

## Testing Checklist

Before running chaos experiments:

- [ ] Lambda function deployed and URL configured
- [ ] Webapp opens in browser
- [ ] Products display correctly
- [ ] Can add items to cart
- [ ] Cart shows correct totals
- [ ] Checkout button enabled with items in cart
- [ ] ToxiProxy running and configured

During experiments:

- [ ] Document hypothesis before each experiment
- [ ] Measure actual behavior (timing, errors, UX)
- [ ] Compare hypothesis to reality
- [ ] Screenshot or record failures
- [ ] Check DynamoDB for data consistency
- [ ] Review CloudWatch Logs for Lambda perspective

## Troubleshooting

### CORS Errors (Expected)

This is **intentional** for the lab. You'll handle CORS in Part 2.

### Webapp Shows "YOUR_LAMBDA_FUNCTION_URL_HERE"

You forgot to update `app.js` with the actual Lambda URL from Terraform.

### ToxiProxy Connection Refused

Ensure Docker is running and ToxiProxy container is started:

```bash
docker-compose ps
docker-compose logs
```

### No Orders in DynamoDB

Check:
1. Lambda logs for errors
2. Browser console for request failures
3. Lambda IAM permissions for DynamoDB

### Lambda Not Responding

Check:
1. Lambda function exists: `aws lambda get-function --function-name chaos-coffee-<student-id>`
2. Function URL configured: Check Terraform outputs
3. CloudWatch Logs for errors

## Next Steps

1. Run chaos experiments with ToxiProxy
2. Document observed failures
3. Design resilience improvements
4. Implement patterns from solutions folder
5. Validate improvements under chaos

Good luck with your chaos engineering journey!
