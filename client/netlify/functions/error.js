// // error.js

// const React = require('react');
// const ReactDOMServer = require('react-dom/server');
// const pagenot = require('../../src/components/pagenot.js');

// exports.handler = async (event, context) => {
//   const html = ReactDOMServer.renderToString(React.createElement(pagenot));
//   return {
//     statusCode: 404,
//     body: html,
//     headers: {
//       'Content-Type': 'text/html',
//     },
//   };
// };













exports.handler = async (event, context) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found</title>
    </head>
    <body>
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; color: red;">404 - Page Not Found</h1>
        <p style="font-size: 1rem; color: gray;">Oops! The page you are looking for might be under construction.</p>
        <a href="/" style="display: inline-block; background-color: blue; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 0.25rem;">Back to Home</a>
      </div>
    </body>
    </html>
  `;

  return {
    statusCode: 404,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  };
};
