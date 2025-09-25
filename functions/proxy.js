const https = require('https');

exports.handler = async function(event, context) {
  // Get the URL parameter from the query string
  const url = decodeURIComponent(event.queryStringParameters.url);

  // Check if the URL is missing
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" query parameter' })
    };
  }

  return new Promise((resolve, reject) => {
    // Make an HTTPS request to the given URL
    https.get(url, (response) => {
      let data = '';

      // Accumulate data as it streams
      response.on('data', chunk => {
        data += chunk;
      });

      // Once the request finishes, send the data back
      response.on('end', () => {
        resolve({
          statusCode: 200,
          body: data,
          headers: {
            'Content-Type': 'text/html', // You can change this based on the content type
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
