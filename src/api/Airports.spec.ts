import AirportsApi from './Airports';
import AirportDB from '../airportDB';
import geo from '../helpers/geo';
import { mocked } from 'ts-jest/utils';

jest.mock('../airportDB');
jest.mock('../helpers/geo');

const airportsApi = new AirportsApi();

describe('Airports API', () => {
    const latitudeCentre = 50;
    const longitudeCentre = 0;
    const radius = 224;
    const longitudeRange = [-2, 2];
    const latitudeRange = [48, 52];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it(`should call 'getLatitudeRange with' 'latitudeCentre'`, () => {
        geo.getLatitudeRange = jest.fn().mockImplementation(() => latitudeRange);

        airportsApi.search(latitudeCentre, longitudeCentre, radius);

        expect(geo.getLatitudeRange).toHaveBeenCalledTimes(1);
        expect(geo.getLatitudeRange).toHaveBeenCalledWith(50, 224);
    });

    it(`should call 'getLongitudeRange with' expected params`, () => {
        geo.getLongitudeRange = jest.fn().mockImplementation(() => longitudeRange);

        airportsApi.search(latitudeCentre, longitudeCentre, radius);

        expect(geo.getLongitudeRange).toHaveBeenCalledTimes(1);
        expect(geo.getLongitudeRange).toHaveBeenCalledWith(0, 50, 224);
    });

    it(`should search with expected params`, () => {
        geo.getLatitudeRange = jest.fn().mockImplementation(() => latitudeRange);
        geo.getLongitudeRange = jest.fn().mockImplementation(() => longitudeRange);
        mocked(AirportDB.findAirports).mockResolvedValue([]);

        airportsApi.search(longitudeCentre, latitudeCentre, radius);

        expect(AirportDB.findAirports).toHaveBeenCalledTimes(1);
        expect(AirportDB.findAirports).toHaveBeenCalledWith(latitudeRange, longitudeRange);
    });

    describe('after empty response', () => {
        beforeEach(() => {
            mocked(AirportDB.findAirports).mockResolvedValue([]);
        });

        it(`should not call 'getDistance'`, async () => {
            geo.getDistance = jest.fn().mockImplementation(() => 23);
            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.getDistance).not.toHaveBeenCalled();
        });

        it(`should not filter by 'isInRadius'`, async () => {
            geo.isInRadius = jest.fn().mockImplementation(() => 23);
            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.isInRadius).not.toHaveBeenCalled();
        });

        it(`should not sort by 'compareByDistance'`, async () => {
            geo.compareByDistance = jest.fn().mockImplementation(() => -1);
            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.compareByDistance).not.toHaveBeenCalled();
        })
    });

    describe('after not empty response', () => {
        const response = {
            total_rows: 2,
            bookmark: 'g1AAAAEPe...',
            rows: [
                {fields: {lat: 3.836039, lon: 11.523461, name: 'Yaounde Ville'}},
                {fields: {lat: 0.0226, lon: 18.288744, name: 'Mbandaka'}},
            ],
            query: 'lon:[ -2 TO 2] AND lat:[ 48 TO 52 ]'
        };

        beforeEach(() => {
            mocked(AirportDB.findAirports).mockResolvedValue(response);
        });

        it(`should call 'getDistance' for every airport`, async () => {
            geo.getDistance = jest.fn().mockImplementation(() => 23);

            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.getDistance).toHaveBeenCalledTimes(2);
        });

        it(`should filter by 'isInRadius'`, async () => {
            geo.isInRadius = jest.fn().mockImplementation(() => 23);

            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.isInRadius).toHaveBeenCalledTimes(2);
        });

        it(`should sort by 'compareByDistance'`, async () => {
            geo.compareByDistance = jest.fn().mockImplementation(() => -1);

            await airportsApi.search(longitudeCentre, latitudeCentre, radius);

            expect(geo.compareByDistance).toHaveBeenCalledTimes(1)
        })
    });


    // should call the db with the right params (lat, long, query format)
    // TODO should handle pagination
    // should call the getDistance function
    // should call the filter distance function (boundig box > radius)
    // should sort the airports by distance

    // integration:
    // endpoint test: TODO validation!!!
    // where to put helpers?
});
