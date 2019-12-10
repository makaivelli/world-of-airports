import AirportsApi from './Airports';
import geo from '../helpers/geo';

jest.mock('../helpers/geo');

describe('Airports API', () => {
    const mockAirportModelWrapper = {
        findAirports: jest.fn(function() {
            return Promise.resolve({
                bookmark: 'whatever',
                total_rows: 3,
                rows: [{
                    id: 1,
                    order: [1, 2],
                    fields: {
                        lat: 1,
                        lon: 2,
                        name: 'test'
                    }
                }]
            });
        }),
    };
    const airportsApi = new AirportsApi(mockAirportModelWrapper);

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

            airportsApi.search(89, 0, 224);
            expect(mockAirportModelWrapper.findAirports).toHaveBeenCalledTimes(1);
            expect(mockAirportModelWrapper.findAirports).toHaveBeenCalledWith([89, 90], [-180, 180]);
        });

        it('should return the results in expected format', async () => {
            geo.getLatitudeOffset = jest.fn().mockImplementation(() => 2);
            geo.getLatitudeStart = jest.fn().mockImplementation(() => 89);
            geo.getLatitudeEnd = jest.fn().mockImplementation(() => 90);
            geo.isOverThePole = jest.fn().mockImplementation(() => true);

            const result = await airportsApi.search(89, 0, 224);

            // Test if pagination object is created
            expect(result).toEqual({
                airports: [],
                pagination: {
                    remainingPages: 2,
                    bookmark: 'whatever',
                    query: {
                        latRange: [89, 90],
                        lonRange: [-180, 180],
                        latCentre: 89,
                        lonCentre: 0,
                        radius: 224
                    }
                }
            });
        })
    });

    describe('getNextPage', () => {
        it(`should call 'findAirports with expected params`, () => {
            airportsApi.getNextPage('g1AAAAE...', 2, [-1, 1], [-2, 2], 0, 0, 112);
            expect(mockAirportModelWrapper.findAirports).toHaveBeenCalledTimes(1);
            expect(mockAirportModelWrapper.findAirports).toHaveBeenCalledWith([-1, 1], [-2, 2], 'g1AAAAE...');
        });

        it('should return the results in expected format', async () => {
            const result = await airportsApi.getNextPage('g1AAAAE...', 2, [-1, 1], [-2, 2], 0, 0, 112);

            // Test if bookmark and remainingPages is updated
            expect(result).toEqual({
                airports: [],
                pagination: {
                    remainingPages: 1,
                    bookmark: 'whatever',
                    query: {
                        latRange: [-1, 1],
                        lonRange: [-2, 2],
                        latCentre: 0,
                        lonCentre: 0,
                        radius: 112
                    }
                }
            });
        });
    });
});
