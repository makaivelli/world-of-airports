import geo from '../helpers/geo';

import AirportDB from '../airportDB';

export default class AirportsApi {
    // integer?
    async search(latitudeCentre: number, longitudeCentre: number, radius: number) {
        // TODO validate
        const latRange: number[] = geo.getLatitudeRange(latitudeCentre, radius);
        const lonRange: number[] = geo.getLongitudeRange(longitudeCentre, latitudeCentre, radius);
        const airports = await AirportDB.findAirports(latRange, lonRange);
        console.log('airports', airports);
        if (airports && airports.length) {
            // TODO handle pagination: request with bookmark if total_rows > rows
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
        }
        return airports;
    }
}
