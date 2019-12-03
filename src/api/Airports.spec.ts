import AirportsApi from './Airports';
import AirportDB from '../airportDB';
import geo from '../helpers/geo';
import { mocked } from 'ts-jest/utils';

jest.mock('../airportDB');
jest.mock('../helpers/geo');

const airportsApi = new AirportsApi();

describe('Airports API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('search', () => {
        it('should get the latitude offset', () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLatitudeOffset).toHaveBeenCalledTimes(1);
            expect(geo.getLatitudeOffset).toHaveBeenCalledWith(0, 112);
        });

        it('should get the latitude start', () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation(() => 1);
            geo.getLatitudeStart = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLatitudeStart).toHaveBeenCalledTimes(1);
            expect(geo.getLatitudeStart).toHaveBeenCalledWith(0, 1);
        });

        it('should get the latitude end', () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation(() => 1);
            geo.getLatitudeEnd = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLatitudeStart).toHaveBeenCalledTimes(1);
            expect(geo.getLatitudeStart).toHaveBeenCalledWith(0, 1);
        });

        it('should get the longitude offset if latitude does not overlap the pole', () => {
            geo.isOverThePole = jest.fn().mockImplementation(() => false);
            geo.getLongitudeOffset = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLongitudeOffset).toHaveBeenCalledTimes(1);
            expect(geo.getLongitudeOffset).toHaveBeenCalledWith(0, 0,112);
        });

        it('should not get the longitude offset if latitude overlaps the pole', () => {
            geo.isOverThePole = jest.fn().mockImplementation(() => true);
            geo.getLongitudeOffset = jest.fn().mockImplementation();

            airportsApi.search(89, 0, 224, );
            expect(geo.getLongitudeOffset).not.toHaveBeenCalled();
        });

        it('should get the longitude start if latitude does not overlap the pole', () => {
            geo.getLongitudeOffset = jest.fn().mockImplementation(() => 1);
            geo.isOverThePole = jest.fn().mockImplementation(() => false);
            geo.getLongitudeStart = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLongitudeStart).toHaveBeenCalledTimes(1);
            expect(geo.getLongitudeStart).toHaveBeenCalledWith(0, 1);
        });

        it('should not get the longitude start if latitude overlaps the pole', () => {
            geo.isOverThePole = jest.fn().mockImplementation(() => true);
            geo.getLongitudeStart = jest.fn().mockImplementation();

            airportsApi.search(89, 0,224, );
            expect(geo.getLongitudeStart).not.toHaveBeenCalled();
        });

        it('should get the longitude end if latitude does not overlap the pole', () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation(() => 1);
            geo.isOverThePole = jest.fn().mockImplementation(() => false);
            geo.getLongitudeEnd = jest.fn().mockImplementation();

            airportsApi.search(0, 0, 112, );
            expect(geo.getLongitudeEnd).toHaveBeenCalledTimes(1);
            expect(geo.getLongitudeEnd).toHaveBeenCalledWith(0, 1);
        });

        it('should not get the longitude end if latitude overlaps the pole', () => {
            geo.isOverThePole = jest.fn().mockImplementation(() => true);
            geo.getLongitudeEnd = jest.fn().mockImplementation();

            airportsApi.search(-89, 0,224, );
            expect(geo.getLongitudeEnd).not.toHaveBeenCalled();
        });

        it(`should call 'findAirports' with expected params`, () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation(() => 2);
            geo.getLatitudeStart = jest.fn().mockImplementation(() => 89);
            geo.getLatitudeEnd = jest.fn().mockImplementation(() => 90);
            geo.isOverThePole = jest.fn().mockImplementation(() => true);
            mocked(AirportDB.findAirports).mockResolvedValue([]);

            airportsApi.search(89, 0, 224);
            expect(AirportDB.findAirports).toHaveBeenCalledTimes(1);
            expect(AirportDB.findAirports).toHaveBeenCalledWith([89, 90], [-180, 180], 224);
        });
    });

    describe('getNextPage', () => {
        it(`should call 'findAirports with expected params`, () => {
            mocked(AirportDB.findAirports).mockResolvedValue([]);

            airportsApi.getNextPage('g1AAAAE...', [-2, 2], [5, 7], 300);
            expect(AirportDB.findAirports).toHaveBeenCalledTimes(1);
            expect(AirportDB.findAirports).toHaveBeenCalledWith([-2, 2], [5, 7], 300);
        });
    });
});
