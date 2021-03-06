import 'zone.js/dist/zone-node';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('../dist-server/main.bundle');
//import { AppServerModuleNgFactory, LAZY_MODULE_MAP } from '../dist-server/main.bundle';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'
import { ngExpressEngine} from '@nguniversal/express-engine';

import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';


const app = express();
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

const distPath = path.resolve(__dirname, '../dist');
const indexFilePath = path.resolve(__dirname, '../dist/index.html');
const indexHtml = fs.readFileSync(indexFilePath).toString();

app.use(
  express.static(distPath, {
    index: false
  })
);

const routes = [
  '/',
  '/products'
];

routes.forEach(
  route => {
    app.get(route, async (req, res) => {
      res.render(indexFilePath, {
        req: req,
        res: res
      });
    });
  }
)

app.listen(4000, () => {
  console.log('http://localhost:4000/');
});
