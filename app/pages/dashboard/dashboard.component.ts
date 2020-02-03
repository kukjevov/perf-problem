import {Component} from '@angular/core';
import {flyInOutTrigger} from '@anglr/animations';
import {ComponentRoute} from '@anglr/common/router';
import {AuthGuard, Authorize} from '@anglr/authentication';

import {BaseAnimatedComponent} from '../../misc/baseAnimatedComponent';

/**
 * Page containing "dashboard"
 */
@Component(
{
    selector: 'dashboard-view',
    templateUrl: 'dashboard.component.html',
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: '', canActivate: [AuthGuard]})
@Authorize("dashboard-page")
export class DashboardComponent extends BaseAnimatedComponent
{
}