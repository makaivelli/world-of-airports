import geo from '../helpers/geo';

import AirportDB from '../airportDB';

export default class AirportsApi {
    // integer?
    private returnSortedAirportsInRange(result, latitudeCentre, longitudeCentre, radius) {
        if (result && result.rows && result.rows.length) {
            const { total_rows, rows: airports, query } = result;
            const airportsWithDistances = airports.map(airport => {
                const { lat, lon, name } = airport.fields;
                const distance = geo.getDistance(latitudeCentre, lat, longitudeCentre, lon);
                return {
                    name,
                    distance
                }
            });
            const airportsInRange = airportsWithDistances.filter(airport => geo.isInRadius(radius, airport.distance));
            const sortedAirportsInRange = airportsInRange.sort((a, b) => geo.compareByDistance(a, b));
            return sortedAirportsInRange;
            return {
                total_rows,
                airports,
                query
            }
        }
        return [];
    }
    async getNextPage(bookmark: string, latRange: number[], lonRange: number[], radius: number): Promise<IAirportsResult[]> {
        const result = await AirportDB.findAirports(latRange, lonRange, radius);
        return this.returnSortedAirportsInRange(result, latRange[0], lonRange[0], radius);
    }
    async search(latitudeCentre: number, longitudeCentre: number, radius: number, bookmark?: string, query?: string) {
        // TODO validate
        // TODO handle pagination in FE side: request with bookmark and query if total_rows > rows
        const latOffset: number = geo.getLatitudeOffset(latitudeCentre, radius);
        // Handle values under and over 90deg
        const latStart: number = geo.getLatitudeStart(latitudeCentre, latOffset);
        const latEnd: number = geo.getLatitudeEnd(latitudeCentre, latOffset);

        //const latEnd: number = latitudeCentre + latOffset > 90 ? 90 : latitudeCentre + latOffset;

        let lonStart: number;
        let lonEnd: number;
        let lonOffset: number;
        // Handle if radius overlaps the pole. We could have a second query only for the overlapping area, but that would add extra complexity around the pagination. Since there isn't too much airport around the poles, and we're filtering the results anyway, it's easier to query all.
        if (geo.isOverThePole(latitudeCentre, latOffset)) {
            lonStart = -180;
            lonEnd = 180;
        } else {
            lonOffset = geo.getLongitudeOffset(longitudeCentre, latitudeCentre, radius);
            // Handle values over and under 180 deg
            lonStart = geo.getLongitudeStart(longitudeCentre, lonOffset);
            lonEnd = geo.getLongitudeEnd(longitudeCentre, lonOffset);
        }
        const result = await AirportDB.findAirports(
            [latStart, latEnd],
            [lonStart, lonEnd],
            radius);
        return this.returnSortedAirportsInRange(result, latitudeCentre, longitudeCentre, radius);
    }
}
