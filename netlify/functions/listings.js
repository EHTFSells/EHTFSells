exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'GET') {
    const stored = process.env.LISTINGS_DATA || '[]';
    return { statusCode: 200, headers, body: stored };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { password, listings } = JSON.parse(event.body);
      if (password !== 'bushnell26') {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, listings }) };
    } catch(e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 200, headers, body: '[]' };
};
