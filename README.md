# Twilio Webhook Server

A Fastify-based server for handling Twilio webhooks with proper form body parsing.

## Features

- ✅ Proper `@fastify/formbody` plugin registration
- ✅ Handles `application/x-www-form-urlencoded; charset=UTF-8` content type
- ✅ SMS webhook endpoint (`/webhook/sms`)
- ✅ Voice webhook endpoint (`/webhook/voice`)
- ✅ Test endpoint (`/webhook/test`)
- ✅ Comprehensive error handling
- ✅ TwiML response generation

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Test locally
npm test
```

## Endpoints

- `GET /` - Health check
- `POST /webhook/sms` - Twilio SMS webhook
- `POST /webhook/voice` - Twilio Voice webhook  
- `POST /webhook/test` - Test endpoint for debugging

## Deployment

This server is designed to work with Railway, Heroku, or any Node.js hosting platform.

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Node.js project
3. Set environment variables if needed
4. Deploy!

## Testing

The included test script (`test.js`) sends a request with the exact content type that Twilio uses:

```
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
```

## Key Fix for HTTP 415 Error

The critical fix for the HTTP 415 error was ensuring `@fastify/formbody` is:

1. ✅ Added to `package.json` dependencies
2. ✅ Registered BEFORE route definitions
3. ✅ Properly configured to handle Twilio's content type

```javascript
// CORRECT: Register plugin before routes
fastify.register(require('@fastify/formbody'));

// Then define routes...
fastify.post('/webhook/sms', async (request, reply) => {
  // request.body will now be properly parsed
});
```

## Common Issues

### HTTP 415 Unsupported Media Type

This error occurs when:
- `@fastify/formbody` plugin is not installed
- Plugin is not registered before route definitions
- Plugin registration has syntax errors

### Solution Verification

The server logs will show successful parsing:
```
{"level":30,"time":1234567890,"msg":"Received test webhook","contentType":"application/x-www-form-urlencoded; charset=UTF-8"}
```