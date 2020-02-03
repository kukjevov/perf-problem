import {RouterModule, Route} from '@angular/router';
//@ts-ignore
import {extractRoutes} from '@anglr/common/router';

import {AccessDeniedComponent} from "../pages/accessDenied/accessDenied.component";
import {NotFoundComponent} from "../pages/notFound/notFound.component";
import {DashboardComponent} from '../pages/dashboard/dashboard.component';

var componentRoutes = extractRoutes([AccessDeniedComponent,
                                     DashboardComponent,
                                     NotFoundComponent]);

var routes: Route[] =
[
    {
        path: 'mosia',
        loadChildren: '../pages/+mosia/mosia.module#MosiaModule'
    },
    ...componentRoutes
];

export var appRoutesModule = RouterModule.forRoot(routes, {enableTracing: false, onSameUrlNavigation: "reload"});
export var appComponents = [AccessDeniedComponent,
                            DashboardComponent,
                            NotFoundComponent];
