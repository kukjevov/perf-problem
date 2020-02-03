import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {InternalServerErrorModule} from '@anglr/error-handling';
// import {PrebootModule} from 'preboot';

import {AppComponent} from './app.component';
import {appComponents, appRoutesModule} from './app.component.routes';
import {NavigationComponent} from "../components";
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {providers} from './app.config';

/**
 * Main module shared for both server and browser side
 */
@NgModule(
{
    imports:
    [
        BrowserModule.withServerTransition(
        {
            appId: APP_TRANSFER_ID
        }),
        HttpClientModule,
        InternalServerErrorModule,
        CommonSharedModule,
        appRoutesModule
    ],
    providers: providers,
    declarations: [AppComponent, NavigationComponent, ...appComponents],
    exports: [AppComponent]
})
export class AppModule
{
}
