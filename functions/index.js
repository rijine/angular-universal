"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("zone.js/dist/zone-node");
const functions = require("firebase-functions");
const express = require("express");
const platform_server_1 = require("@angular/platform-server");
const module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
const fs = require("fs");
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist-server/main.bundle');
const document = fs.readFileSync(__dirname + '/dist/index.html', 'utf8');
const app = express();
app.get('**', (req, res) => {
    const url = req.path;
    platform_server_1.renderModuleFactory(AppServerModuleNgFactory, { document, url,
        extraProviders: [
            module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP)
        ]
    }).then(html => {
        res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
        res.send(html);
    });
});
exports.ssrapp = functions.https.onRequest(app);
