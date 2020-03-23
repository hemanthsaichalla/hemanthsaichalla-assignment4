require('dotenv').config({ path: 'UI.env' });
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
app.use(express.static('public'));

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget }));
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
const env = { UI_API_ENDPOINT };

app.get('/env.js', (req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.listen(process.env.UI_SERVER_PORT, () => {
  console.log(`UI started on port ${process.env.UI_SERVER_PORT}`);
});

