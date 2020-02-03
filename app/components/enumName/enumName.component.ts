import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ValueNamePair, isBlank} from '@jscrpt/common';
import {BootstrapSelectDirective} from '@anglr/bootstrap/select';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {EnumService} from "../../services/api/enum/enum.service";
import {KodPopisValue} from '../../misc/types';

/**
 * Component used for obtaining and creating enumeration of values
 */
@Component(
{
    selector: 'select[enumName]',
    template: `<option *ngFor="let item of data" [value]="item.value">{{item.name}}</option>`,
    providers: [EnumService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumNameComponent implements OnInit
{
    //######################### public properties - input #########################

    /**
     * Name of enum which values will be filled into select
     */
    @Input()
    public enumName: string;

    /**
     * Indication that service that returns kratkypopis popis is called
     */
    @Input()
    public popisService: boolean;

    /**
     * If this is not empty, empty value with this text will be added
     */
    @Input()
    public emptyValueText: string;

    /**
     * Indication that use codes also for description of value
     */
    @Input()
    public onlyCodes: boolean;

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
        if(isBlank(this.enumName))
        {
            throw new Error("No name was provided for enumName component!");
        }

        let enumsObservable: Observable<KodPopisValue[]>;

        if(this.popisService)
        {
            enumsObservable = this._enums.getEnumPopis(this.enumName);
        }
        else
        {
            enumsObservable = this._enums.getEnum(this.enumName);
        }

        enumsObservable
            .subscribe(data =>
            {
                let tmp: ValueNamePair[];

                if(this.mappingCallback)
                {
                    tmp = data.map(this.mappingCallback);
                }
                else
                {
                    tmp = data.map(itm => { return {value: itm.kod, name: itm.popis}; });
                }

                if(this.onlyCodes)
                {
                    tmp = tmp.map(itm => { return {value: itm.value, name: itm.value}; });
                }

                tmp = tmp.filter(itm => isPresent(itm));

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
            });
    }
}

