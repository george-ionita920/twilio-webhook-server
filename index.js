const fastify = require('fastify')({ logger: true });

// Register the formbody plugin BEFORE defining routes
// This is crucial for parsing application/x-www-form-urlencoded content
fastify.register(require('@fastify/formbody'));

// Health check endpoint
fastify.get('/', async (request, reply) => {
  return { 
    status: 'healthy', 
    message: 'Twilio Webhook Server is running',
    timestamp: new Date().toISOString()
  };
});

// Twilio SMS webhook endpoint
fastify.post('/webhook/sms', async (request, reply) => {
  try {
    fastify.log.info('Received SMS webhook:', request.body);
    
    const { From, Body, MessageSid } = request.body;
    
    // Create TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for your message: "${Body}". We received it from ${From}.</Message>
</Response>`;
    
    reply
      .type('application/xml')
      .send(twimlResponse);
      
  } catch (error) {
    fastify.log.error('Error processing SMS webhook:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// Twilio Voice webhook endpoint
fastify.post('/webhook/voice', async (request, reply) => {
  try {
    fastify.log.info('Received voice webhook:', request.body);
    
    const { From, CallSid } = request.body;
    
    // Create TwiML response for voice
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Hello! Thank you for calling from ${From}. This is a test webhook response.</Say>
  <Pause length="1"/>
  <Say voice="alice">Goodbye!</Say>
</Response>`;
    
    reply
      .type('application/xml')
      .send(twimlResponse);
      
  } catch (error) {
    fastify.log.error('Error processing voice webhook:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// Generic webhook endpoint for testing
fastify.post('/webhook/test', async (request, reply) => {
  try {
    fastify.log.info('Received test webhook:', {
      headers: request.headers,
      body: request.body,
      contentType: request.headers['content-type']
    });
    
    return {
      success: true,
      message: 'Webhook received successfully',
      receivedData: request.body,
      contentType: request.headers['content-type']
    };
    
  } catch (error) {
    fastify.log.error('Error processing test webhook:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.statusCode === 415) {
    reply.status(415).send({
      error: 'Unsupported Media Type',
      message: 'This endpoint expects application/x-www-form-urlencoded content',
      received: request.headers['content-type']
    });
  } else {
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();