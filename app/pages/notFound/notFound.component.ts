import {Component} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';
import {StatusCodeService} from '@anglr/common';
import {flyInOutTrigger} from '@anglr/animations';
import {BaseAnimatedComponent} from "../../misc/baseAnimatedComponent";

/**
 * Page displayed when url was not found
 */
@Component(
{
    selector: 'not-found-view',
    templateUrl: 'notFound.component.html',
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: '**'})
export class NotFoundComponent extends BaseAnimatedComponent
{

    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        super();

        this._additionalCssClasses = "full-height";

        statusCodeService.setStatusCode(404);
    }
}