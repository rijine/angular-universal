import 'zone.js/dist/zone-node';
import * as functions from 'firebase-functions';
import * as express from 'express';

import { renderModuleFactory } from '@angular/platform-server';

import * as fs from 'fs';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('../dist-server/main.bundle');

const document = fs.readFileSync(__dirname + 'dist/index.html', 'utf8');

const app = express();

app.get('**', (req, res) => {
  const url = req.path;
  renderModuleFactory(AppServerModuleNgFactory, { document, url }).then(
    html => {
      res.set('Cache-Control', 'public, max-age=600, s-maxage=1200')
      res.send(html);
    }
  );
});


export let ssrapp = functions.https.onRequest(app);