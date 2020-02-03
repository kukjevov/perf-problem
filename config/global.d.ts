declare module "config/global"
{
    var _tmp:
    {
        /**
         * Indication that application is running in debug mode
         */
        debug: boolean;
               
        /**
         * Base url that is used for accessing REST api
         */
        apiBaseUrl: string;
        
        /**
         * Object hodling default headers that are send with rest requests
         */
        defaultApiHeaders: { [key: string]: string };
        
        /**
         * Visual theme for UI themed pages
         */
        theme: string;
    };

    export = _tmp;
}

declare module "config/version"
{
    var _tmp:
    {
        /**
         * Version of current running application
         */
        version: string;
    };

    export = _tmp;
}

declare var isProduction: boolean;
declare var isNgsw: boolean;