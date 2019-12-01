const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportDB = cloudant.db.use('airportdb');

// TODO class or module?
// TODO instantiate? dbname, etc?
// TODO docstrings
export default class AirportDB {
    static async findAirports(latitudeRange: number[], longitudeRange: number[], bookmark?: string) {
        const query =
            `lon:[ ${longitudeRange[0]} TO ${longitudeRange[1]}] AND lat:[ ${latitudeRange[0]} TO ${latitudeRange[1]}]`;
        // TODO try / catch
        // Handle pagination
        let params = bookmark ? {q: query, bookmark} : {q: query};
        const results = await airportDB.search('view1', 'geo', params);
        return {...results, query};
    }
}