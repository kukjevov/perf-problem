import {OrderByDirection, isPresent} from "@jscrpt/common";

import {Orderable, KodPopisValue} from "../../misc/types";

/**
 * Class used for static utility misc methods
 */
export class Misc
{
    /**
     * Transforms all first level properties to 'kod' and their values to 'popis' array
     * @param {any} obj Object to be transformed
     */
    public static transformObjectToKodPopisValue(obj: any): KodPopisValue[]
    {
        let result: KodPopisValue[] = [];

        if(obj)
        {
            Object.keys(obj).forEach(prop =>
            {
                result.push(
                {
                    kod: prop,
                    popis: obj[prop]
                });
            });
        }

        return result;
    }

    /**
     * Transforms orderable data to requested format
     * @param {Orderable} ordering Object with definition of ordering
     */
    public static transformOrderable(ordering: Orderable): Orderable
    {
        if(!ordering)
        {
            return ordering;
        }

        if(ordering.sort && isPresent(ordering.direction))
        {
            ordering.sort = `${ordering.sort},${ordering.direction == OrderByDirection.Descendant ? 'desc' : 'asc'}`;
        }
        else
        {
            delete ordering.sort;
        }

        delete ordering.direction;

        return ordering;
    }
}