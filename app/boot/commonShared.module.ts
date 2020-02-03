import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BootstrapModule} from '@anglr/bootstrap';
import {GridModule} from '@anglr/grid';
import {DialogMetadataSelectorModule} from '@anglr/grid/material';
import {NgSelectModule} from '@anglr/select';
import {CommonModule as NgCommonModule, ProgressIndicatorModule} from '@anglr/common';
import {NumberInputModule, HasErrorModule} from '@anglr/common/forms';
import {NumeralModule} from '@anglr/common/numeral';
import {MomentModule} from '@anglr/common/moment';
import {NotificationsModule} from '@anglr/notifications';
import {InternalServerErrorModule, ServerValidationsModule} from '@anglr/error-handling';
import {AuthorizationModule} from '@anglr/authentication';
import {HotkeyModule} from 'angular2-hotkeys';

import {EnumNameComponent, VahaTagComponent} from "../components";
import {EnumNameDirective, SubmittedScopeDirective} from "../directives";

/**
 * Common module for all other modules
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgCommonModule,
        NumeralModule
    ],
    declarations:
    [
        EnumNameComponent,
        EnumNameDirective,
        VahaTagComponent,
        SubmittedScopeDirective
    ],
    exports:
    [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgCommonModule,
        ProgressIndicatorModule,
        NumeralModule,
        NumberInputModule,
        NotificationsModule,
        GridModule,
        DialogMetadataSelectorModule,
        NgSelectModule,
        HasErrorModule,
        AuthorizationModule,
        InternalServerErrorModule,
        ServerValidationsModule,
        BootstrapModule,
        HotkeyModule,
        MomentModule,
        EnumNameComponent,
        EnumNameDirective,
        VahaTagComponent,
        SubmittedScopeDirective
    ]
})
export class CommonSharedModule
{
}