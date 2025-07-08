const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const host = '0.0.0.0'; // Allow external connections

const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/home/your-user/ssl/server.key'),
  cert: fs.readFileSync('/home/your-user/ssl/server.crt'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, host, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${host}:${port}`);
  });
});