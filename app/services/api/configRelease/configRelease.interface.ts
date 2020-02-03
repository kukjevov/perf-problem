import {ValueNamePair} from "@jscrpt/common";

export type HisType = 'VšZP'|'Union';
export type HisCode = 'VSZP'|'UNION';

export interface ConfigReleaseProstredie
{
    nazov?: string;
    fg?: string;
    bg?: string;
}

/**
 * Config release object
 */
export interface ConfigReleaseData
{
    /**
     * Build time of this version
     */
    build?: string;

    /**
     * Server version info
     */
    release?: string;
    
    /**
     * Name of running server application
     */
    title?: string;

    /**
     * Name of the server side application
     */
    name?: string;
    
    /**
     * Name of used logo
     */
    logo?: string;
    
    /**
     * Default database name
     */
    defaultDatabase?: string;

    /**
     * Default datasource name
     */
    defaultDatasource?: string;

    /**
     * Short name of HIC
     */
    customerShort?: HisType;

    /**
     * Code for HIC
     */
    customerCode?: HisCode;

    /**
     * Name of HIC
     */
    customer?: string;

    /**
     * Array of used libraries, where value is version number and name is name of library
     */
    usedLibraries?: ValueNamePair[];

    /**
     * Information about 'prostredie'
     */
    prostredie?: ConfigReleaseProstredie;
}

export interface ConfigSettings
{
    "mosia.export.produkt.maxrows"?: string;
    "mosia.export.produkt.batchsize"?: string;
    [key: string]: string;
}