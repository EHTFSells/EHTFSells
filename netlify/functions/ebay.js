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

    const response = await fetch('https://api.ebay.com/ws/api.dll', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'X-EBAY-API-SITEID': '3',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-CALL-NAME': callName,
        'X-EBAY-API-APP-NAME': APP_ID,
      },
      body: body
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/xml'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
