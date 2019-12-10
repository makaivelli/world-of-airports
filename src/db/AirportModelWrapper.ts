import { IAirportsDBResult } from '../types';

const DESIGN_NAME = 'view1';
const SEARCH_NAME = 'geo';

/**
 * Wrapper around airport (search) model.
 * Contains query logic and helps unit testing.
 */
export default class AirportModelWrapper {
    private readonly airportDBWrapper: any;
    constructor(airportDBWrapper) {
        this.airportDBWrapper = airportDBWrapper;
    }

    async findAirports(latitudeRange: number[],
                              longitudeRange: number[],
                              bookmark?: string): Promise<IAirportsDBResult> {
        // Format query params
        const query =
            `lon:[ ${longitudeRange[0]} TO ${longitudeRange[1]}] AND lat:[ ${latitudeRange[0]} TO ${latitudeRange[1]}]`;
        // Handle next page query
        const params = bookmark ? {q: query, bookmark} : {q: query};

        try {
            return await this.airportDBWrapper.search(DESIGN_NAME, SEARCH_NAME, params);
        } catch (e) {
            console.error(e); // In real code I'd use an error tracking / monitoring tool
            throw new Error('Error');
        }
    }
}
