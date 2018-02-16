import 'zone.js/dist/zone-node';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('../dist-server/main.bundle');
//import { AppServerModuleNgFactory, LAZY_MODULE_MAP } from '../dist-server/main.bundle';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';

const app = express();

const distPath = path.resolve(__dirname, '../dist');
const indexFilePath = path.resolve(__dirname, '../dist/index.html');
const indexHtml = fs.readFileSync(indexFilePath).toString();

app.use(
  express.static(distPath, {
    index: false
  })
);

app.get('/', async (req, res) => {
  const html = await renderModuleFactory(AppServerModuleNgFactory, {
    url: '/',
    document: indexHtml,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  });
  res.send(html);
});

app.get('/products', async (req, res) => {
  const html = await renderModuleFactory(AppServerModuleNgFactory, {
    url: '/products',
    document: indexHtml,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  });
  res.send(html);
});

app.listen(4000, () => {
  console.log('http://localhost:4000/');
});
