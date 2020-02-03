import {FactoryProvider, APP_INITIALIZER, ClassProvider, ValueProvider, ExistingProvider} from '@angular/core';
import {AuthenticationService, AUTH_INTERCEPTOR_PROVIDER, AUTH_INTERCEPTOR_CONFIG, AUTHENTICATION_SERVICE_OPTIONS, SUPPRESS_AUTH_INTERCEPTOR_PROVIDER} from '@anglr/authentication';
import {PROGRESS_INTERCEPTOR_PROVIDER, GlobalizationService} from "@anglr/common";
import {REPORTING_EXCEPTION_HANDLER_PROVIDER, HttpErrorInterceptorOptions, HTTP_ERROR_INTERCEPTOR_PROVIDER, HttpGatewayTimeoutInterceptorOptions, NoConnectionInterceptorOptions, HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER, NO_CONNECTION_INTERCEPTOR_PROVIDER, SERVICE_UNAVAILABLE_INTERCEPTOR_PROVIDER} from '@anglr/error-handling';
import {NO_DATA_RENDERER_OPTIONS, NoDataRendererOptions, METADATA_SELECTOR_OPTIONS, QueryCookiePagingInitializerComponent, QueryCookiePagingInitializerOptions, PAGING_INITIALIZER_TYPE, PAGING_INITIALIZER_OPTIONS, PAGING_OPTIONS, BasicPagingOptions, METADATA_SELECTOR_TYPE} from '@anglr/grid';
import {DialogMetadataSelectorOptions, DialogMetadataSelectorComponent, VerticalDragNDropSelectionTexts} from '@anglr/grid/material';
import {NG_SELECT_OPTIONS, NgSelectOptions, NORMAL_STATE_OPTIONS, NormalStateOptions} from '@anglr/select';
import {RestTransferStateService} from '@anglr/rest';
import * as config from 'config/global';

// import 'ScrollMagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

import {AuthConfig} from '../services/api/account/authConfig';
import {AccountService} from '../services/api/account/account.service';
import {GlobalizationService as GlobalizationServiceImpl} from '../services/globalization/globalization.service';
import {NOTHING_SELECTED} from '../misc/constants';
import {ConfigReleaseService} from '../services/api/configRelease';

/**
 * Creates APP initialization factory, that first try to authorize user before doing anything else
 * @param authService Authentication service used for authentication of user
 */
export function appInitializerFactory(authService: AuthenticationService<any>)
{
    return () =>
    {
        return new Promise(success =>
        {
            authService
                .getUserIdentity()
                .then(() => success())
                .catch(reason => alert(`Authentication failed: ${JSON.stringify(reason)}`));
        });
    };
}

/**
 * Factory for HttpErrorInterceptorOptions
 */
export function httpErrorInterceptorOptionsFactory()
{
    return new HttpErrorInterceptorOptions(config.debug, null, response => response.status == 400 || response.status == 405 || response.status > 406);
}

/**
 * Factory method for creating HttpGatewayTimeoutInterceptorOptions
 */
export function httpGatewayTimeoutInterceptorOptionsFactory()
{
    return new HttpGatewayTimeoutInterceptorOptions("Server neodpovedal v stanovenom čase.");
}

/**
 * Factory method for creating NoConnectionInterceptorOptions
 */
export function noConnectionInterceptorOptionsFactory()
{
    return new NoConnectionInterceptorOptions("Server je mimo prevádzky.");
}

/**
 * Array of providers that are used in app module
 */
export var providers =
[
    //######################### GLOBAL RESOLVERS, TOKENS AND SERVICES #########################
    ConfigReleaseService,

    //######################### HTTP INTERCEPTORS #########################
    HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER,
    SERVICE_UNAVAILABLE_INTERCEPTOR_PROVIDER,
    HTTP_ERROR_INTERCEPTOR_PROVIDER,
    NO_CONNECTION_INTERCEPTOR_PROVIDER,
    SUPPRESS_AUTH_INTERCEPTOR_PROVIDER,
    AUTH_INTERCEPTOR_PROVIDER,
    PROGRESS_INTERCEPTOR_PROVIDER,

    //######################### NO CONNECTION INTERCEPTOR OPTIONS #########################
    <FactoryProvider>
    {
        useFactory: noConnectionInterceptorOptionsFactory,
        provide: NoConnectionInterceptorOptions
    },

    //######################### HTTP GATEWAY TIMEOUT INTERCEPTOR OPTIONS #########################
    <FactoryProvider>
    {
        useFactory: httpGatewayTimeoutInterceptorOptionsFactory,
        provide: HttpGatewayTimeoutInterceptorOptions
    },

    //######################### AUTH INTERCEPTOR OPTIONS #########################
    <ClassProvider>
    {
        provide: AUTH_INTERCEPTOR_CONFIG,
        useClass: AuthConfig
    },

    //######################### GLOBALIZATION SERVICE #########################
    <ClassProvider>
    {
        provide: GlobalizationService,
        useClass: GlobalizationServiceImpl
    },

    //######################### AUTHENTICATION & AUTHORIZATION #########################
    AccountService,
    <ExistingProvider>
    {
        provide: AUTHENTICATION_SERVICE_OPTIONS,
        useExisting: AccountService
    },

    //######################### ERROR HANDLING #########################
    <FactoryProvider>
    {
        provide: HttpErrorInterceptorOptions,
        useFactory: httpErrorInterceptorOptionsFactory
    },
    REPORTING_EXCEPTION_HANDLER_PROVIDER,

    //######################### DISABLING REST TRANSFER STATE #########################
    <ValueProvider>
    {
        provide: RestTransferStateService,
        useValue: null
    },

    //######################### APP INITIALIZER #########################
    <FactoryProvider>
    {
        useFactory: appInitializerFactory,
        provide: APP_INITIALIZER,
        deps: [AuthenticationService],
        multi: true
    },

    //######################### GRID GLOBAL OPTIONS #########################
    <ValueProvider>
    {
        provide: PAGING_OPTIONS,
        useValue: <BasicPagingOptions>
        {
            itemsPerPageValues: [15, 30, 60],
            initialItemsPerPage: 15
        }
    },
    <ValueProvider>
    {
        provide: PAGING_INITIALIZER_TYPE,
        useValue: QueryCookiePagingInitializerComponent
    },
    <ValueProvider>
    {
        provide: PAGING_INITIALIZER_OPTIONS,
        useValue: <QueryCookiePagingInitializerOptions>
        {
            cookieIppName: "all-grid-ipp"
        }
    },
    <ValueProvider>
    {
        provide: NO_DATA_RENDERER_OPTIONS,
        useValue: <NoDataRendererOptions<any>>
        {
            text: "Neboli nájdené dáta odpovedajúce zadaným parametrom"
        }
    },
    <ValueProvider>
    {
        provide: METADATA_SELECTOR_TYPE,
        useValue: DialogMetadataSelectorComponent
    },
    <ValueProvider>
    {
        provide: METADATA_SELECTOR_OPTIONS,
        useValue: <DialogMetadataSelectorOptions<any>>
        {
            showButtonVisible: false,
            texts:
            {
                btnShowSelection: 'VÝBER STĹPCOV',
                dialogComponentTexts: <VerticalDragNDropSelectionTexts>
                {
                    selectionTitle: 'stĺpce'
                }
            }
        }
    },

    //############################ SELECT GLOBAL OPTIONS ############################
    <ValueProvider>
    {
        provide: NG_SELECT_OPTIONS,
        useValue: <NgSelectOptions<any>>
        {
            autoInitialize: false
        }
    },
    <ValueProvider>
    {
        provide: NORMAL_STATE_OPTIONS,
        useValue: <NormalStateOptions<any>>
        {
            texts:
            {
                nothingSelected: NOTHING_SELECTED
            }
        }
    }
];
