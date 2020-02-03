import {Directive} from "@angular/core";
import {SubmittedService} from "@anglr/common/forms";

/**
 * Directive that creates new submitted service scope
 */
@Directive(
{
    selector: '[submittedScope]',
    exportAs: 'submittedScope',
    providers: [SubmittedService]
})
export class SubmittedScopeDirective
{
    //######################### constructor #########################
    constructor(public submittedSvc: SubmittedService)
    {
    }
}