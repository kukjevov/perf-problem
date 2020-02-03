export interface KodPopisValue
{
    kod?: string;

    popis?: string;

    original?: any;
}

export interface KodPopisValueServer extends KodPopisValue
{
    kodServer?: string;
}

export interface KodPopisValueText extends KodPopisValue
{
    text?: string;
}