// error.js

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const pagenot = require('../../src/components/pagenot.js');

exports.handler = async (event, context) => {
  const html = ReactDOMServer.renderToString(React.createElement(pagenot));
  return {
    statusCode: 404,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  };
};
