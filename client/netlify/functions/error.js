// netlify/functions/error.js
// functions/netlify/error.js
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const PageNotFound = require('../../client/src/components/PageNotFound');

exports.handler = async (event, context) => {
  const html = ReactDOMServer.renderToString(React.createElement(PageNotFound));
  return {
    statusCode: 404,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  };
};


// // netlify/functions/error.js
// exports.handler = async () => {
//   return {
//     statusCode: 404,
//     body: '<html><body><h1>Custom 404 Page</h1><p>Sorry, the page you are looking for does not exist.</p></body></html>',
//     headers: {
//       'Content-Type': 'text/html',
//     },
//   };
// };
