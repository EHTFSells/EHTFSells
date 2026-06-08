const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore({ name: 'ehtf-listings', consistency: 'strong' });

    if (event.httpMethod === 'GET') {
      try {
        const data = await store.get('listings', { type: 'json' });
        return { statusCode: 200, headers, body: JSON.stringify(data || []) };
      } catch(e) {
        return { statusCode: 200, headers, body: '[]' };
      }
    }

    if (event.httpMethod === 'POST') {
      const { password, listings } = JSON.parse(event.body);
      if (password !== 'bushnell26') {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
      await store.setJSON('listings', listings);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

  } catch (err) {
    console.log('Error:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
