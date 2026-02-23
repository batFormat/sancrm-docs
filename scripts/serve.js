const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const chokidar = require('chokidar');
const express = require('express');
const serveStatic = require('serve-static');

const {parse, serialize} = require('parse5');
const utils = require('parse5-utils');

const glob = require('glob');
const {debounce} = require('lodash');
const open = require('open');

const watcher = new chokidar.FSWatcher({
  ignored: ['_build/**', 'node_modules/**', '.git/**', '.ai-factory/**'],
});

class Server {
  constructor(parameters = {}) {
    const {
      autoOpen = true,

      watchPattern = 'docs/**/*.{md,yaml}',

      port = 8000,

      serveIndexes = ['index.html'],
      serveDir = '_build',
      cacheControl = false,

      ssePath = '/events',
      sseEventName = 'reload',
      sseEventMessage = 'rebuilt',
    } = parameters;

    this.configs = {
      autoOpen,
      watchPattern,
      port,
      serveIndexes,
      serveDir,
      cacheControl,
      ssePath,
      sseEventName,
      sseEventMessage,
    };

    this.configs.sseScript = `
const events = new EventSource("${this.configs.ssePath}");

events.addEventListener("${this.configs.sseEventName}", function(e) {
  window.location.reload();
});
`;

    this.configure();
  }

  configure() {
    this.app = express();
    this.app.use(serveStatic(this.configs.serveDir, {
      index: this.configs.serveIndexes,
      cacheControl: this.configs.cacheControl,
    }));
    this.app.get(this.configs.ssePath, this.sseRequestHandler.bind(this));
    this.app.get('/', (req, res) => {
      res.redirect('/index.html');
    });
    this.sseResponseMessage = `event: ${this.configs.sseEventName}\ndata: ${this.configs.sseEventMessage}\n\n`;

    this.injectSSE();

    watcher.add(this.configs.watchPattern);
  }

  sseRequestHandler(req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.flushHeaders();

    watcher.on('all', debounce((event, filePath) => {
      console.info(`event: ${event}, path: ${filePath}`);

      try {
        this.buildDocumentation.call(this);
      } catch (err) {
        console.error('failed building documentation:', err);
      }

      this.injectSSE.call(this);
      this.sendSSEReloadResponse.call(this, res);
    }, 500));
  }

  buildDocumentation() {
    console.info('building documentation');
    execSync('npm run build', {stdio: 'inherit'});
  }

  injectSSE() {
    console.info('injecting sse into html');

    const pattern = path.join(this.configs.serveDir, '**', '*.html');
    const paths = glob.globSync(pattern, {ignore: 'node_modules/**'}).map(
      (p) => path.join(process.cwd(), p),
    );

    for (const filePath of paths) {
      try {
        const html = fs.readFileSync(filePath, 'utf8');
        const transformed = this.injectSSEIntoHTML(html, this.configs.sseScript);
        fs.writeFileSync(filePath, transformed, {encoding: 'utf8'});
      } catch (err) {
        console.error(`failed to inject SSE into ${filePath}:`, err);
      }
    }
  }

  sendSSEReloadResponse(res) {
    console.info('sending sse event');
    res.write(this.sseResponseMessage);
  }

  injectSSEIntoHTML(html, sse) {
    const parsed = parse(html);

    traverse(parsed, (node) => {
      if (node.nodeName === 'head') {
        const sseScript = utils.createNode('script');
        const sseScriptBody = utils.createTextNode(sse);

        utils.append(sseScript, sseScriptBody);
        utils.append(node, sseScript);
      }
    });

    return serialize(parsed);
  }

  listen() {
    this.app.listen(this.configs.port);

    console.info(`serving on: http://localhost:${this.configs.port}/`);

    if (this.configs.autoOpen) {
      open(`http://localhost:${this.configs.port}/`);
    }
  }
}

function traverse(node, cb) {
  cb(node);

  const childNodes = node['childNodes'];
  if (!childNodes) {
    return;
  }

  for (const childNode in childNodes) {
    traverse(childNodes[childNode], cb);
  }
}

const server = new Server();
server.listen();
