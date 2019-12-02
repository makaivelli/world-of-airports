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
    async getNextPage(bookmark: string, latRange: number[], lonRange: number[], radius: number) {
        const result = await AirportDB.findAirports(latRange, lonRange, radius);
        return this.returnSortedAirportsInRange(result, latRange[0], lonRange[0], radius);
    }
    async search(latitudeCentre: number, longitudeCentre: number, radius: number, bookmark?: string, query?: string) {
        // TODO validate
        // TODO handle pagination in FE side: request with bookmark and query if total_rows > rows
        const latRange: number[] = geo.getLatitudeRange(latitudeCentre, radius);
        const lonRange: number[] = geo.getLongitudeRange(longitudeCentre, latitudeCentre, radius);
        const result = await AirportDB.findAirports(latRange, lonRange, radius);
        return this.returnSortedAirportsInRange(result, latitudeCentre, longitudeCentre, radius);
    }
}
