const req = require('http').request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(res.statusCode, d));
});
req.write(JSON.stringify({ firstName: 'Test', lastName: 'User', email: 'testx@example.com', password: 'password123' }));
req.end();
