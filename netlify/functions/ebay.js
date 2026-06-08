const https = require('https');

exports.handler = async function(event) {
  const { callName, body } = JSON.parse(event.body);
  const APP_ID = 'ElliotHa-EHTFSell-PRD-d9968b8a6-1379ff01';

  const options = {
    hostname: 'api.ebay.com',
    path: '/ws/api.dll',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'X-EBAY-API-SITEID': '3',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
      'X-EBAY-API-CALL-NAME': callName,
      'X-EBAY-API-APP-NAME': APP_ID,
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/xml' },
          body: data
        });
      });
    });
    req.on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
    req.write(body);
    req.end();
  });
};
