import {Injectable} from '@angular/core';
import {GET, BaseUrl, DefaultHeaders, Cache, ResponseTransform, RESTClient} from '@anglr/rest';
import {ValueNamePair, isString} from '@jscrpt/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as global from 'config/global';

import {ConfigReleaseData, ConfigSettings} from './configRelease.interface';

/**
 * Service used to access configuration of application
 */
@Injectable()
@BaseUrl(`${global.apiBaseUrl}config`)
@DefaultHeaders(global.defaultApiHeaders)
export class ConfigReleaseService extends RESTClient
{
    //######################### public methods #########################

    /**
     * Gets configuration of app
     * @returns Observable
     */
    @Cache()
    @ResponseTransform()
    @GET("/release")
    public get(): Observable<ConfigReleaseData>
    {
        return null;
    }

    /**
     * Gets settings of app
     * @returns Observable
     */
    @Cache()
    @GET("/settings")
    public getSettings(): Observable<ConfigSettings>
    {
        return null;
    }

    //######################### private methods #########################

    /**
     * Transform response from get method
     */
    //@ts-ignore
    private getResponseTransform(response: Observable<ConfigReleaseData>): Observable<ConfigReleaseData>
    {
        return response.pipe(map(result =>
        {
            if(result.usedLibraries && result.usedLibraries.length)
            {
                result.usedLibraries = result.usedLibraries.map((lib: any) =>
                {
                    let library: string = lib;

                    if(!isString(library))
                    {
                        return library;
                    }

                    let match = /^(.*?-.*?)-(.*?)$/.exec(library);

                    return <ValueNamePair>{
                        name: match[1],
                        value: match[2]
                    };
                });
            }

            return result;
        }));
    }
}
