const https = require('https');
const url = require('url');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { callName, body } = JSON.parse(event.body);
    const APP_ID = 'ElliotHa-EHTFSell-PRD-d9968b8a6-1379ff01';

    const xmlResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.ebay.com',
        path: '/ws/api.dll',
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'Content-Length': Buffer.byteLength(body),
          'X-EBAY-API-SITEID': '3',
          'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
          'X-EBAY-API-CALL-NAME': callName,
          'X-EBAY-API-APP-NAME': APP_ID,
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/xml'
      },
      body: xmlResponse
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
