import AirportModelWrapper from './AirportModelWrapper';

describe('AirportModelWrapper', () => {
    describe('findAirports', () => {
        const mockAirportDBWrapper = {
            search: jest.fn(function() {
                return;
            }),
        };
        const airportModelWrapper = new AirportModelWrapper(mockAirportDBWrapper);

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call search with expected params', async () => {
            const design_name = expect.any(String);
            const search_name = expect.any(String);
            await airportModelWrapper.findAirports([-2, 2], [-40, 50]);

            expect(mockAirportDBWrapper.search).toHaveBeenCalledTimes(1);
            expect(mockAirportDBWrapper.search).toHaveBeenCalledWith(
                design_name,
                search_name,
                { q: 'lon:[ -40 TO 50] AND lat:[ -2 TO 2]' });

        });

        it('should call search with bookmark', async () => {
            const design_name = expect.any(String);
            const search_name = expect.any(String);
            await airportModelWrapper.findAirports([-2, 2], [-40, 50], 'whatever');

            expect(mockAirportDBWrapper.search).toHaveBeenCalledTimes(1);
            expect(mockAirportDBWrapper.search).toHaveBeenCalledWith(
                design_name,
                search_name,
                { q: 'lon:[ -40 TO 50] AND lat:[ -2 TO 2]', bookmark: 'whatever' })
        });
    });

    describe('findAirports on success', () => {
        it('should return the search result', async() => {
            const mockAirportDBWrapper = {
                search: jest.fn(function() {
                    return Promise.resolve('success response');
                }),
            };
            const airportModelWrapper = new AirportModelWrapper(mockAirportDBWrapper);

            const result = await airportModelWrapper.findAirports([-2, 2], [-40, 50]);
            expect(result).toBe('success response');
        });
    });

    describe('findAirports on fail', () => {
        it('should throw an error with expected message', async() => {
            const mockAirportDBWrapper = {
                search: jest.fn(function() {
                    return Promise.reject('error response');
                }),
            };
            const airportModelWrapper = new AirportModelWrapper(mockAirportDBWrapper);

            try {
                await airportModelWrapper.findAirports([-2, 2], [-40, 50]);
                // Force fail test
                expect(false).toBe(true);
            } catch (e) {
                expect(e.message).toBe('Error');
            }
        });
    });
});
