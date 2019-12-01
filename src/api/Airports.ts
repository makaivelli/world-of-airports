import geo from '../helpers/geo';

const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportsDB = cloudant.db.use('airportdb');

export default class AirportsApi {
    // integer?
    search(latitudeCentre: number, longitudeCentre: number, radius: number) {
        // TODO validate
        const latRange: number[] = geo.getLatitudeRange(latitudeCentre, radius);
        const lonRange: number[] = geo.getLongitudeRange(longitudeCentre, latitudeCentre, radius);
        const query = ''; // TODO
        const results = {rows: []}; // TODO airportsDB.search('view1', 'geo', {q: query});
        // TODO handle pagination: request with bookmark if total_rows > rows
        const airportsWithDistances = results.rows.map(airport => {
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
}
