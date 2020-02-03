import {Component} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';
import {StatusCodeService} from '@anglr/common';
import {flyInOutTrigger} from '@anglr/animations';
import {BaseAnimatedComponent} from "../../misc/baseAnimatedComponent";

/**
 * Component used for displaying access denied page
 */
@Component(
{
    selector: 'access-denied-view',
    templateUrl: "accessDenied.component.html",
    animations: [flyInOutTrigger]
})
@ComponentRoute({path:'accessDenied'})
export class AccessDeniedComponent extends BaseAnimatedComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        super();

        this._additionalCssClasses = "full-height";

        statusCodeService.setStatusCode(403);
    }
}