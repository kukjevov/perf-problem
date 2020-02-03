import 'modernizr';
import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {runWhenModuleStable} from '@anglr/common';
import * as config from 'config/global';

import {BrowserAppModule} from './boot/browser-app.module';

if(isProduction)
{
    enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => 
{
    runWhenModuleStable(platformBrowserDynamic().bootstrapModule(BrowserAppModule, {preserveWhitespaces: true}), (moduleRef: NgModuleRef<{}>) => 
    {
    }, config.debug);
});