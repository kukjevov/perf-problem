import {NgModule, ValueProvider} from '@angular/core';
import {RouterModule} from '@angular/router';
import {QueryCookiePagingInitializerOptions, PAGING_INITIALIZER_OPTIONS} from '@anglr/grid';

import {MosiaComponent} from "./mosia.component";
import {componentRoutes, components} from './mosia.component.routes';
import {CommonSharedModule} from "../../boot/commonShared.module";
import {HodnotenieService, MetadataService} from '../../services/api/hodnotenie';
import {OknoComponent} from './hodnotenie/okno/okno.component';
import {TabulkaComponent} from './hodnotenie/tabulka/tabulka.component';
import {TabulkaRiadokComponent} from './hodnotenie/tabulkaRiadok/tabulkaRiadok.component';
import {ChartComponent} from './hodnotenie/charts/chart.component';
import {OverviewLineComponent} from './hodnotenie/overviewLine/overviewLine.component';
import {HodnotenieDataResolver, HodnotenieStateChanging} from './hodnotenie/hodnotenieData.resolver';
import {EnumService} from '../../services/api/enum/enum.service';
import {EnumNameZsComponent, SipkaTagComponent, EnumNameZsDirective, MosiaFormatPipe} from './misc';

/**
 * Module for mosia pages
 */
@NgModule(
{
    declarations:
    [
        MosiaComponent,
        EnumNameZsComponent,
        EnumNameZsDirective,
        OknoComponent,
        TabulkaComponent,
        TabulkaRiadokComponent,
        SipkaTagComponent,
        ChartComponent,
        OverviewLineComponent,
        MosiaFormatPipe,
        ...components
    ],
    imports:
    [
        CommonSharedModule,
        RouterModule.forChild(
        [
            {path: '', component: MosiaComponent, children: componentRoutes},
        ])
    ],
    providers:
    [
        HodnotenieService,
        EnumService,
        MetadataService,
        HodnotenieDataResolver,
        HodnotenieStateChanging,
        <ValueProvider>
        {
            provide: PAGING_INITIALIZER_OPTIONS,
            useValue: <QueryCookiePagingInitializerOptions>
            {
                cookieIppName: "mosia-grid-ipp"
            }
        }
    ]
})
export class MosiaModule
{
}
