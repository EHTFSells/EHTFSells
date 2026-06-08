const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore('ehtf-listings');

    if (event.httpMethod === 'GET') {
      let listings = [];
      try {
        const data = await store.get('listings', { type: 'json' });
        listings = data || [];
      } catch(e) {
        listings = [];
      }
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(listings)
      };
    }

    if (event.httpMethod === 'POST') {
      const { password, listings } = JSON.parse(event.body);
      if (password !== 'bushnell26') {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
      await store.setJSON('listings', listings);
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      };
    }

    return { statusCode: 405, headers, body: 'Method not allowed' };

  } catch (err) {
    console.log('Blob error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
