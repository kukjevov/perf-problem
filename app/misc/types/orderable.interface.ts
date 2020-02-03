import {OrderByDirection} from "@jscrpt/common";

/**
 * Interface for ordering
 */
export interface Orderable
{
    /**
     * (Name, direction) of column which should be used for ordering
     */
    sort: string;

    /**
     * Direction for ordered column
     */
    direction: OrderByDirection;
}