import {Observable, Observer} from 'rxjs';

import {KodPopisValue} from "../../../misc/types";
import {PriznakPoistenec} from "./enum.interface";

/**
 * Mock class for EnumService for testing
 */
export class EnumServiceMock
{
    //######################### public properties #########################
    public getPriznakyPoistenecSpy: jasmine.Spy;
    public getEnumSpy: jasmine.Spy;

    //######################### constructor #########################
    constructor()
    {
        this.getPriznakyPoistenecSpy = spyOn(this, 'getPriznakyPoistenec').and.returnValue(Observable.create((observer: Observer<PriznakPoistenec[]>) => { observer.next([]); observer.complete(); }));
        this.getEnumSpy = spyOn(this, 'getEnum').and.returnValue(Observable.create((observer: Observer<KodPopisValue[]>) => { observer.next([]); observer.complete(); }));
    }

    //######################### public methods #########################

    /**
     * Gets enum of priznaky poistenec
     * @returns Observable
     */
    public getPriznakyPoistenec(): Observable<PriznakPoistenec[]>
    {
        return null;
    }

    /**
     * Gets enum of specified type
     * @returns Observable
     */
    public getEnum(type: string): Observable<KodPopisValue[]>
    {
        return null;
    }
}
