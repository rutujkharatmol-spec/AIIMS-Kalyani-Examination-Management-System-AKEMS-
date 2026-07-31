const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/students',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer mock_jwt_token_123'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
