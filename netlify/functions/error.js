// // netlify/functions/error.js
// import React from 'react';
// import ReactDOMServer from 'react-dom/server';
// import PageNotFound from '../../client/src/components/PageNotFound';

// exports.handler = async (event, context) => {
//   const html = ReactDOMServer.renderToString(<PageNotFound />);
//   return {
//     statusCode: 404,
//     body: html,
//     headers: {
//       'Content-Type': 'text/html',
//     },
//   };
// };



// netlify/functions/error.js
exports.handler = async () => {
  return {
    statusCode: 404,
    body: '<html><body><h1>Custom 404 Page</h1><p>Sorry, the page you are looking for does not exist.</p></body></html>',
    headers: {
      'Content-Type': 'text/html',
    },
  };
};
