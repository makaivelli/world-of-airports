import { IAirportsDBResult } from '../types';

const DESIGN_NAME = 'view1';
const SEARCH_NAME = 'geo';

/**
 * Wrapper around airport (search) model.
 * Contains query logic and helps unit testing.
 */
export default class AirportModelWrapper {
    private airportDB: any;
    constructor(airportDB) {
        this.airportDB = airportDB;
        console.log('this.airportDB', this.airportDB);
    }

    async findAirports(latitudeRange: number[],
                              longitudeRange: number[],
                              bookmark?: string): Promise<IAirportsDBResult> {
        // Format query params
        const query =
            `lon:[ ${longitudeRange[0]} TO ${longitudeRange[1]}] AND lat:[ ${latitudeRange[0]} TO ${latitudeRange[1]}]`;
        // Handle next page query
        const params = bookmark ? {q: query, bookmark} : {q: query};
        
        console.log('params', params);

        try {
            return await this.airportDB.search(DESIGN_NAME, SEARCH_NAME, params);
        } catch (e) {
            console.error(e);
            throw new Error('Error');
        }
    }
}
