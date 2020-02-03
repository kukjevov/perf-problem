import {Component, OnDestroy} from '@angular/core';
import {GlobalizationService} from '@anglr/common';
import {consoleAnimationTrigger} from '@anglr/common/structured-log';
import {AuthenticationService} from '@anglr/authentication';
import * as moment from 'moment';
import * as store from 'store';
import * as expirePlugin from 'store/plugins/expire';

/**
 * Application entry component
 */
@Component(
{
    selector: 'app',
    templateUrl: "app.component.html",
    animations: [consoleAnimationTrigger]
})
export class AppComponent implements OnDestroy
{
    //######################### public properties - template bindings #########################

    /**
     * Indication whether is console visible
     */
    public consoleVisible: boolean = false;

    //######################### constructor #########################
    constructor(authentication: AuthenticationService<any>,
                globalization: GlobalizationService)
    {
        store.addPlugin(expirePlugin);

        moment.locale(globalization.locale);

        authentication
            .getUserIdentity()
            .then(identity =>
            {
                if(!identity)
                {
                    console.error("User identity was not returned!");
                }

                if(!identity.isAuthenticated && !authentication.isAuthPage())
                {
                    authentication.showAuthPage();
                }
            });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
    }
}