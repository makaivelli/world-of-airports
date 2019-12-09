export interface IFieldRow {
    lat: number,
    lon: number,
    name: string
}

export interface IAirportRow {
    // TODO what else?
    id: string,
    fields: IFieldRow,
    order: number[]
}

export interface IAirportsDBResult {
    total_rows: number,
    bookmark: string,
    // TODO or []
    rows: IAirportRow[]
}

export interface IAirports {
    name: string,
    lat: number,
    lon: number,
    distance: number
}

export interface IQuery {
    latRange: number[],
    lonRange: number[],
    latCentre: number,
    lonCentre: number,
    radius: number
}

export interface IPagination {
    query: IQuery,
    remainingPages: number,
    bookmark: number
}

export interface IAirportsResult {
    airports: IAirports[],
    pagination: IPagination[]
}
