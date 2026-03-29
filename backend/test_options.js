const req = require('http').request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/login',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
}, res => {
  console.log('Status', res.statusCode);
  console.log('Headers', res.headers);
});
req.end();
