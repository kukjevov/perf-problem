import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "@anglr/authentication";
import {Subscription} from 'rxjs';
import * as config from 'config/global';

import {ConfigReleaseData, ConfigReleaseService} from "../../services/api/configRelease";

/**
 * Navigation component containing navigation menu
 */
@Component(
{
    selector: 'nav',
    templateUrl: 'navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for change of authentication
     */
    private _authSubscription: Subscription = null;

    /**
     * Subscription for navigation changes
     */
    private _navigationSubscription: Subscription = null;

    /**
     * Method used for triggering jira issue collector
     */
    private _showCollectorDialog: () => void;

    /**
     * Subscription for update check
     */
    private _updateCheckSubscription: Subscription;
    //######################### public properties #########################

    /**
     * Indication that update is available
     */
    public updateAvailable: boolean = false;

    /**
     * Instance of config object
     */
    public config: ConfigReleaseData = null;

    /**
     * Logged user full name
     */
    public fullName: string = "";

    /**
     * Name of database
     */
    public databaseName: string = "nezvolená";

    /**
     * Config obj containing configuration
     */
    public configObj = config;

    /**
     * Array of debug kie bases
     */
    public debugKieBases: string[] = [];

    //######################### constructor #########################
    constructor(private _configReleaseService: ConfigReleaseService,
                private _authService: AuthenticationService<any>,
                private _router: Router,
                private _changeDetector: ChangeDetectorRef)
    {
        this._navigationSubscription = this._router
            .events
            .subscribe(() => this._changeDetector.detectChanges());
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._authService
            .getUserIdentity()
            .then(userIdentity =>
            {
                if(userIdentity.isAuthenticated)
                {
                    this.fullName = `${userIdentity.firstName} ${userIdentity.surname}`;
                    this._changeDetector.detectChanges();
                }
            });

        this._authSubscription = this._authService
            .authenticationChanged
            .subscribe(userIdentity =>
            {
                if(userIdentity.isAuthenticated)
                {
                    this.fullName = `${userIdentity.firstName} ${userIdentity.surname}`;
                    this._changeDetector.detectChanges();
                }
                else
                {
                    this.fullName = '';
                    this._changeDetector.detectChanges();
                }
            });

        this._configReleaseService.get().subscribe(data =>
        {
            this.config = data;

            this._changeDetector.detectChanges();
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._authSubscription)
        {
            this._authSubscription.unsubscribe();
            this._authSubscription = null;
        }

        if(this._navigationSubscription)
        {
            this._navigationSubscription.unsubscribe();
            this._navigationSubscription = null;
        }

        if(this._updateCheckSubscription)
        {
            this._updateCheckSubscription.unsubscribe();
            this._updateCheckSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Reports issue to jira
     */
    public reportError()
    {
        this._showCollectorDialog();
    }

    /**
     * Activates update
     */
    public activateUpdate()
    {
    }

    /**
     * Performs logout from system
     */
    public logout()
    {
        this._authService
            .logout()
            .subscribe(() =>
            {
                this._router.navigate(['/login']);
            });
    }

    /**
     * Sets kie bases that are displayed for debugging
     */
    public setDebugKieBases(kieBases: string[])
    {
        this.debugKieBases = kieBases;

        this._changeDetector.detectChanges();
    }
}