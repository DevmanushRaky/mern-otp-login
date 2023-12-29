// netlify/functions/error.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PageNotFound from '../../client/src/components/PageNotFound';

exports.handler = async (event, context) => {
  const html = ReactDOMServer.renderToString(<PageNotFound />);
  return {
    statusCode: 404,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  };
};
