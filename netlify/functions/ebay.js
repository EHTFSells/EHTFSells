const https = require('https');

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
    const APP_ID = process.env.EBAY_APP_ID;
    const CERT_ID = process.env.EBAY_CERT_ID;

    console.log('APP_ID present:', !!APP_ID);
    console.log('CERT_ID present:', !!CERT_ID);

    const credentials = Buffer.from(`${APP_ID}:${CERT_ID}`).toString('base64');
    const postData = 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope';

    const tokenResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.ebay.com',
        path: '/identity/v1/oauth2/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          console.log('Token status:', res.statusCode);
          console.log('Token response:', data.substring(0, 300));
          try { resolve(JSON.parse(data)); } catch(e) { reject(new Error('Token parse error: ' + data)); }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    if (!tokenResponse.access_token) {
      throw new Error('No access token: ' + JSON.stringify(tokenResponse));
    }

    const searchResponse = await new Promise((resolve, reject) => {
      const path = '/buy/browse/v1/item_summary/search?seller_username=elliohaydo_0&limit=50';

      const options = {
        hostname: 'api.ebay.com',
        path: path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenResponse.access_token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        console.log('Browse API status:', res.statusCode);
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          console.log('Browse response:', data.substring(0, 500));
          resolve(data);
        });
      });
      req.on('error', reject);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: searchResponse
    };

  } catch (err) {
    console.log('Error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
