import {Injectable} from "@angular/core";
import {BaseUrl, DefaultHeaders, ResponseTransform, GET, QueryObject, ParameterTransform, Path, Cache, POST, Query, Body, DELETE, RESTClient} from "@anglr/rest";
import {isPresent, extend} from "@jscrpt/common";
import {Observable, Observer, of, forkJoin} from "rxjs";
import {map, flatMap} from "rxjs/operators";
import * as global from 'config/global';
import * as moment from 'moment';

import {Pageable, PagedData, Orderable, KodPopisValue} from "../../../misc/types";
import {HodnoteniePrehladMetadata, HodnotenieFilter, Hodnotenie, HodnotenieDetail, MosiaChartData, ChartRequest, MosiaSprava, MosiaUtvarDetailPzs, DetailMetadata, MosiaUtvarDetailPzsGrouped} from "./hodnotenie.interface";
import {Misc} from "../misc.static";
import {EnumService} from "../enum/enum.service";

/**
 * Service used to access data of 'hodnotenie'
 */
@Injectable()
@BaseUrl(`${global.apiBaseUrl}mosia`)
@DefaultHeaders(global.defaultApiHeaders)
export class HodnotenieService extends RESTClient
{
    /**
     * Gets all 'hodnotenie'
     * @returns Observable
     */
    public getAll(paging?: Pageable,
                  ordering?: Orderable,
                  filter?: HodnotenieFilter): Observable<PagedData<Hodnotenie>>
    {
        return this._getAll(paging, ordering, filter).pipe(
            flatMap(data =>
            {
                let enumService = this.injector.get(EnumService);

                return forkJoin(
                    of(data),
                    enumService.getEnumObj('typPripaduMosia'),
                    enumService.getEnumObj('typUtvaru'),
                    enumService.getEnumObj('typPzs')
                );
            }),
            map(data =>
            {
                let [result, typZs, typUtvaru, typPzs] = data;

                result.content.forEach(itm =>
                {
                    itm.typZS = typZs[itm.typZS] && (typZs[itm.typZS] as any).kratkyPopis;
                    itm.typUtvaruOrig = itm.typUtvaru;
                    itm.typUtvaru = typUtvaru[itm.typUtvaru] && (typUtvaru[itm.typUtvaru] as any).kratkyPopis;
                    itm.typPzs = typPzs[itm.typPzs] && (typPzs[itm.typPzs] as any).kratkyPopis;
                    itm.uuidPzs = itm.uuid.replace(/^(.*?-.*?)-.*?-(.*)$/, `$1-VSETCI-$2`);
                });

                return result;
            }));
    }

    /**
     * Gets all 'hodnotenie' metadata
     * @returns Observable
     */
    @Cache()
    @GET("/meta/lekamb/detail")
    public getMetadata(): Observable<DetailMetadata>
    {
        return null;
    }

    /**
     * Gets all 'hodnotenie' metadata for 'PZS'
     * @returns Observable
     */
    @Cache()
    @GET("/meta/pzs/detail ")
    public getMetadataPzs(): Observable<DetailMetadata>
    {
        return null;
    }

    /**
     * Gets all 'hodnotenie' metadata for 'prehlad'
     * @returns Observable
     */
    @Cache()
    @GET("/meta/lekamb/prehlad")
    public getPrehladMetadata(): Observable<HodnoteniePrehladMetadata[]>
    {
        return null;
    }

    /**
     * Gets all 'ambulancie'
     * @returns Observable
     */
    @ResponseTransform()
    @GET("/ambulancie/{idPzs}/{obdobie}")
    public getPzsAmbulancie(@Path('idPzs') idPzs: string,
                            @Path('obdobie') obdobie: string): Observable<MosiaUtvarDetailPzsGrouped[]>
    {
        return null;
    }

    /**
     * Gets detail of 'hodnotenie'
     * @returns Observable
     */
    public getDetail(id: string, hlavneUkazovatele?: boolean): Observable<HodnotenieDetail>
    {
        return Observable.create(async (observer: Observer<HodnotenieDetail>) =>
        {
            let result = await this._getDetail(id, hlavneUkazovatele).toPromise();
            let enumService = this.injector.get(EnumService);
            let typPzs = await enumService.getEnumObj('typPzs').toPromise();

            result.typPzs = typPzs[result.typPzs] && (typPzs[result.typPzs] as any).popis;

            if(result.atributy)
            {
                Object.keys(result.atributy).forEach(nalepkamosia =>
                {
                    if(nalepkamosia.indexOf("STAT-") != 0 && result.atributy[nalepkamosia].length)
                    {
                        result.atributy[nalepkamosia] = result.atributy[nalepkamosia][0];
                    }
                });
            }

            if(result.spravy && result.spravy.length)
            {
                result.spravy.forEach(sprava =>
                {
                    if(isPresent(sprava.cas))
                    {
                        sprava.cas = moment(sprava.cas);

                        if(!sprava.cas.isValid)
                        {
                            sprava.cas = null;
                        }
                    }
                });
            }

            observer.next(result);
            observer.complete();
        });
    }

    /**
     * Gets array of all 'obdobia'
     * @returns Observable
     */
    @GET("/lekamb/obdobia/{id}")
    public getObdobia(@Path('id') id: string): Observable<string[]>
    {
        return null;
    }

    /**
     * Gets data for 'graf'
     */
    @GET('/graf/{id}')
    public getChart(@Path('id') id: string,
                    @QueryObject params: ChartRequest): Observable<MosiaChartData>
    {
        return null;
    }

    /**
     * Create new note
     * @param {string} id Id of parent record
     * @param {string} text Text to be stored for note
     * @param {number} obdobie Obdobie
     */
    @ResponseTransform()
    @POST('/lekamb/{id}/sprava')
    public createNote(@Path('id') id: string,
                      @Body text: string,
                      @Query('obdobie') obdobie?: string): Observable<MosiaSprava>
    {
        return null;
    }

    /**
     * Removes note from database
     * @param {string} id Id of record
     * @param {string} noteId Id of note
     */
    @DELETE('/lekamb/{id}/sprava/{noteId}')
    public deleteNote(@Path('id') id: string,
                      @Path('noteId') noteId: string): Observable<MosiaSprava>
    {
        return null;
    }

    /**
     * Returns all available 'obdobia'
     */
    @GET("/lekamb/obdobia")
    public getAllObdobia(): Observable<string[]>
    {
        return null;
    }

    //######################### private methods #########################

    /**
     * Gets all 'hodnotenie'
     * @returns Observable
     */
    @POST("/lekamb")
    private _getAll(@QueryObject paging?: Pageable,
                    @QueryObject @ParameterTransform('orderableTransform') ordering?: Orderable,
                    @Body @ParameterTransform('hodnotenieFilterTransform') filter?: HodnotenieFilter): Observable<PagedData<Hodnotenie>>
    {
        return null;
    }

    /**
     * Gets detail of 'hodnotenie'
     * @returns Observable
     */
    @GET("/lekamb/{id}")
    private _getDetail(@Path('id') id: string,
                       @Query('hlavneUkazovatele') hlavneUkazovatele?: boolean): Observable<HodnotenieDetail>
    {
        return null;
    }

    //######################### private methods #########################

    /**
     * Transform response from getPzsAmbulancie method
     */
    //@ts-ignore
    private getPzsAmbulancieResponseTransform(response: Observable<MosiaUtvarDetailPzs[]>): Observable<MosiaUtvarDetailPzsGrouped[]>
    {
        return response.pipe(map(result =>
        {
            let res: {[key: string]: MosiaUtvarDetailPzs[]} = {};

            result.forEach(data =>
            {
                if(!res[data.typZs])
                {
                    res[data.typZs] = [];
                }

                res[data.typZs].push(data);
            });

            let $return: MosiaUtvarDetailPzsGrouped[] = [];

            for(let typZs in res)
            {
                $return.push(
                {
                    typZs: typZs,
                    data: res[typZs]
                });
            }

            $return = $return.sort((a, b) =>
            {
                let aValue = a.typZs;
                let bValue = b.typZs;

                if(aValue == bValue)
                {
                    return 0;
                }

                return aValue < bValue ? 1 : -1;
            });

            return $return;
        }));
    }

    /**
     * Transform response from createNote method
     */
    //@ts-ignore
    private createNoteResponseTransform(response: Observable<MosiaSprava>): Observable<MosiaSprava>
    {
        return response.pipe(map(result =>
        {
            if(isPresent(result.cas))
            {
                result.cas = moment(result.cas);

                if(!result.cas.isValid)
                {
                    result.cas = null;
                }
            }

            return result;
        }));
    }

    /**
     * Transforms orderable data to requested format
     */
    //@ts-ignore
    private orderableTransform(ordering: Orderable): Orderable
    {
        return Misc.transformOrderable(ordering);
    }

    /**
     * Transforms HodnotenieFilter method
     */
    //@ts-ignore
    private hodnotenieFilterTransform(filter: HodnotenieFilter)
    {
        if(!filter)
        {
            return filter;
        }

        filter = extend({}, filter);

        if(filter.idLekar && filter.idLekar.kod)
        {
            filter.idLekar = <any>filter.idLekar.kod;
        }

        if(filter.idPzs && filter.idPzs.kod)
        {
            filter.idPzs = <any>filter.idPzs.kod;
        }

        if(filter.refSk && Array.isArray(filter.refSk))
        {
            filter.refSk = <any>filter.refSk.map(drg => (drg as KodPopisValue).kod);
        }

        return filter;
    }
}