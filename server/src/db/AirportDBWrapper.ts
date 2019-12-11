import { IAirportsDBResult } from '../types';

const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportDB = cloudant.db.use('airportdb');

/**
 * Wrapper around remote DB.
 * Separates the actual DB access from query logic and helps unit testing.
 */
export default class AirportDBWrapper {
    public search(DESIGN_NAME: string, SEARCH_NAME: string, params: object): Promise<IAirportsDBResult> {
        return airportDB.search(DESIGN_NAME, SEARCH_NAME, params)
    }
}
