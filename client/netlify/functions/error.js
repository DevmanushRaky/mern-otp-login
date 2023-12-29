// error.js

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const PageNotFound = require('../../src/components/PageNotFound.js');

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
