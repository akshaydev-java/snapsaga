const http = require('http');

function request(options, data) {
  return new Promise((resolve) => {
    const req = http.request(options, res => {
      let d = '';
      res.on('data', c => d+=c);
      res.on('end', () => resolve({status: res.statusCode, data: d, headers: res.headers}));
    });
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const loginRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ email: 'admin@snapsage.com', password: 'admin123' }));
  
  if (loginRes.status !== 200) {
    console.log('Login failed', loginRes.status, loginRes.data);
    return;
  }
  
  const token = JSON.parse(loginRes.data).accessToken;
  console.log('Got token', typeof token);
  
  const statusRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/purchase/status', method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Purchase Status:', statusRes.status, statusRes.data);
})();
