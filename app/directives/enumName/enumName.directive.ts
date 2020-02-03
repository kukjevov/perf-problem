import {Directive, OnInit, Input} from '@angular/core';
import {isPresent, isString, ValueNamePair, isBlank} from '@jscrpt/common';
import {NgSelectComponent, CodeOptionsGatherer, NgSelectOption} from '@anglr/select';
import {reinitializeOptions} from '@anglr/select/extensions';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {EnumService} from "../../services/api/enum/enum.service";
import {KodPopisValue} from '../../misc/types';
import {NOTHING_SELECTED} from '../../misc/constants';

/**
 * Directive used for obtaining and creating enumeration of values
 */
@Directive(
{
    selector: 'ng-select[enumName]',
    providers: [EnumService]
})
export class EnumNameDirective implements OnInit
{
    //######################### private fields #########################

    /**
     * Enum options gatherer instance
     */
    private _codeOptionsGatherer: CodeOptionsGatherer<string> = new CodeOptionsGatherer<string>();

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
     * Indication that service that returns obj is called
     */
    @Input()
    public objService: boolean;

    /**
     * If this is not empty, empty value with this text will be added
     */
    @Input()
    public emptyValueText: string|boolean;

    /**
     * Indication that use codes also for description of value
     */
    @Input()
    public onlyCodes: boolean;

    /**
     * Indication that use texts also for value
     */
    @Input()
    public onlyTexts: boolean;

    /**
     * Transform mapping function for item
     */
    @Input()
    public mappingCallback: (item: any) => ValueNamePair;

    /**
     * Additional data to be passed as query params
     */
    @Input()
    public additionalData: Object;

    //######################### constructor #########################
    constructor(private _enums: EnumService,
                private _select: NgSelectComponent<string>)
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
            throw new Error("No name was provided for enumName directive!");
        }

        this._select.execute(reinitializeOptions(
        {
            optionsGatherer: this._codeOptionsGatherer
        }));

        let enumsObservable: Observable<KodPopisValue[]>;

        if(this.popisService)
        {
            enumsObservable = this._enums.getEnumPopis(this.enumName, this.additionalData);
        }
        else if(this.objService)
        {
            enumsObservable = this._enums.getEnumObj(this.enumName, this.additionalData)
                .pipe(map(itm => 
                {
                    let result = [];

                    Object.keys(itm).forEach(name =>
                    {
                        result.push(<KodPopisValue>
                        {
                            kod: name,
                            popis: itm[name].kratkyPopis || itm[name].popis,
                            original: itm[name]
                        });
                    });

                    return result;
                }));
        }
        else
        {
            enumsObservable = this._enums.getEnum(this.enumName, this.additionalData);
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
                else if(this.onlyTexts)
                {
                    tmp = tmp.map(itm => { return {value: itm.name, name: itm.name}; });
                }

                tmp = tmp.filter(itm => isPresent(itm));

                if(this.emptyValueText)
                {
                    tmp =
                    [
                        {
                            value: '',
                            name: isString(this.emptyValueText) ? this.emptyValueText : NOTHING_SELECTED
                        },
                        ...tmp
                    ];
                }

                this._codeOptionsGatherer.options = tmp.map(itm =>
                {
                    return <NgSelectOption<string>>
                    {
                        value: itm.value,
                        text: itm.name
                    };
                });
        
                this._codeOptionsGatherer.optionsChange.emit();
                this._codeOptionsGatherer.availableOptionsChange.emit();
            });
    }
}

