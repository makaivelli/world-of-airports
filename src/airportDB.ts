import { IAirportsDBResult } from './types';

const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportDB = cloudant.db.use('airportdb');
const DESIGN_NAME = 'view1';
const SEARCH_NAME = 'geo';

// TODO class or module?
// TODO instantiate? dbname, etc?
// TODO docstrings
export default class AirportDB {
    static async findAirports(
        latitudeRange: number[],
        longitudeRange: number[],
        bookmark?: string): Promise<IAirportsDBResult> {
        const query =
            `lon:[ ${longitudeRange[0]} TO ${longitudeRange[1]}] AND lat:[ ${latitudeRange[0]} TO ${latitudeRange[1]}]`;
        const params = bookmark ? {q: query, bookmark} : {q: query};
        try {
            return await airportDB.search(DESIGN_NAME, SEARCH_NAME, params);
        } catch (e) {
            console.error(e);
            throw new Error('Error, try again later');
        }
    }
}
