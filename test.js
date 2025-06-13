const http = require('http');
const querystring = require('querystring');

// Test data that mimics Twilio's webhook format
const testData = {
  MessageSid: 'SMtest123',
  AccountSid: 'ACtest123',
  From: '+1234567890',
  To: '+0987654321',
  Body: 'Hello, this is a test message!',
  NumMedia: '0'
};

const postData = querystring.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/webhook/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing webhook with Twilio-like request...');
console.log('Content-Type:', options.headers['Content-Type']);
console.log('Data:', testData);

const req = http.request(options, (res) => {
  console.log(`\nResponse Status: ${res.statusCode}`);
  console.log('Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Test PASSED - Server correctly handled form data!');
    } else {
      console.log('\n❌ Test FAILED - Server returned error');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request failed: ${e.message}`);
});

req.write(postData);
req.end();