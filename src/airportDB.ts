const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportDB = cloudant.db.use('airportdb');

// TODO class or module?
// TODO instantiate? dbname, etc?
// TODO docstrings
export default class AirportDB {
    static async findAirports(latitudeRange: number[], longitudeRange: number[], radius: number, bookmark?: string) {
        // radius is needed for filtering later
        const query =
            `lon:[ ${longitudeRange[0]} TO ${longitudeRange[1]}] AND lat:[ ${latitudeRange[0]} TO ${latitudeRange[1]}]`;
        // TODO try / catch
        // Handle pagination
        // can get params with explain?
        let params = bookmark ? {q: query, bookmark} : {q: query};
        try {
            const results = await airportDB.search('view1', 'geo', params);
            return { ...results, latitudeRange, longitudeRange, radius };
        } catch (e) {
            console.error(e);
            throw new Error('Error, try again later');
        }
    }
}