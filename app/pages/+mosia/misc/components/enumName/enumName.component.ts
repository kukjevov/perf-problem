import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewChecked} from '@angular/core';
import {ValueNamePair, isBlank, nameof} from '@jscrpt/common';
import {BootstrapSelectDirective} from '@anglr/bootstrap/select';

import {EnumService} from "../../../../../services/api/enum/enum.service";
import {KodPopisValue} from '../../../../../misc/types';

/**
 * Extended KodPopisValue
 */
interface KodPopisNa extends KodPopisValue
{
    vazbaNa: string[];
}

/**
 * Component used for obtaining and creating enumeration of values
 */
@Component(
{
    selector: 'select[enumNameZs]',
    template: `<option *ngFor="let item of data" [value]="item.value">{{item.name}}</option>`,
    providers: [EnumService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumNameZsComponent implements OnInit, OnChanges, AfterViewChecked
{
    //######################### private fields #########################

    /**
     * Obtained all data
     */
    private _allData: KodPopisNa[] = [];

    //######################### public properties - input #########################

    /**
     * Name of enum which values will be filled into select
     */
    @Input()
    public enumNameZs: string;

    /**
     * Currently selected 'typ ZS'
     */
    @Input()
    public typZs: string;

    /**
     * If this is not empty, empty value with this text will be added
     */
    @Input()
    public emptyValueText: string;

    /**
     * Transform mapping function for item
     */
    @Input()
    public mappingCallback: (item: any) => ValueNamePair;

    //######################### public properties #########################

    /**
     * Data that are displayed in select
     */
    public data: ValueNamePair[] = [];

    //######################### constructor #########################
    constructor(private _enums: EnumService,
                private _select: BootstrapSelectDirective,
                private _changeDetection: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(isBlank(this.enumNameZs))
        {
            throw new Error("No name was provided for enumNameZs component!");
        }

        let enumsObservable = this._enums.getEnumObj(this.enumNameZs);

        enumsObservable
            .subscribe(result =>
            {
                Object.keys(result).forEach(key =>
                {
                    this._allData.push(
                    {
                        kod: key,
                        popis: result[key].popis,
                        vazbaNa: result[key].vazbaNa
                    });
                });

                this._setData();
            });
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<EnumNameZsComponent>('typZs') in changes && this.typZs && !changes[nameof<EnumNameZsComponent>('typZs')].firstChange)
        {
            this._setData();
        }
    }

    //######################### public methods - implementation of AfterViewCheck #########################

    public ngAfterViewChecked(): void 
    {
        this._changeDetection.detectChanges();
        this._select.refresh();
    }

    //######################### private methods #########################

    /**
     * Filters data based on typZS
     */
    private _setData()
    {
        let tmp: ValueNamePair[];
        let allData = this._allData;

        if(this.typZs)
        {
            allData = allData.filter(itm => !!itm.vazbaNa.find(itm => itm == this.typZs));
        }

        if(this.mappingCallback)
        {
            tmp = allData.map(this.mappingCallback);
        }
        else
        {
            tmp = allData.map(itm => { return {value: itm.kod, name: itm.popis}; });
        }

        if(this.emptyValueText)
        {
            this.data =
            [
                {
                    value: '',
                    name: this.emptyValueText
                },
                ...tmp
            ];
        }
        else
        {
            this.data = tmp;
        }

        this._select.collection = this.data;
        this._changeDetection.markForCheck();
    }
}

