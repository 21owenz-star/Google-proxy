// functions/proxy.js
const https = require('https');

exports.handler = async function(event, context) {
  const url = decodeURIComponent(event.queryStringParameters.url);  // Get the URL to proxy from the query parameter

  // Check if URL is provided
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" parameter' })
    };
  }

  return new Promise((resolve, reject) => {
    // Make an HTTPS request to the URL
    https.get(url, (response) => {
      let data = '';

      // Accumulate data
      response.on('data', chunk => {
        data += chunk;
      });

      // When response is finished, send back the data
      response.on('end', () => {
        resolve({
          statusCode: 200,
          body: data,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      });
    }).on('error', (error) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      });
    });
  });
};
