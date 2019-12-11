import AirportsRoute from './Airports';
import * as express from 'express';

describe('AirportsRoute', () => {
    const mockAirportsApi = {
        search: jest.fn(function() {
            return Promise.resolve('api search response');
        }),
        getNextPage: jest.fn(function() {
            return Promise.resolve('api getNextPage response');
        }),
    };

    const airportsRoute = new AirportsRoute(mockAirportsApi);

    const mockResponse = () => {
        const res = {
            json: undefined,
            status: undefined
        };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        describe('validation', () => {
            describe('of first query', () => {
                [
                    {
                        key: 'lat',
                        value: null,
                        reason: `Fields 'lat', 'lon' and 'range' are required when 'prevQuery' is not present`
                    }, {
                        key: 'lon',
                        value: null,
                        reason: `Fields 'lat', 'lon' and 'range' are required when 'prevQuery' is not present`
                    }, {
                        key: 'rad',
                        value: null,
                        reason: `Fields 'lat', 'lon' and 'range' are required when 'prevQuery' is not present`
                    }, {
                        key: 'lat',
                        value: 'whatever',
                        reason: `Field 'lat', must be a number`
                    }, {
                        key: 'lon',
                        value: 'whatever',
                        reason: `Field 'lon', must be a number`
                    }, {
                        key: 'rad',
                        value: 'whatever',
                        reason: `Field 'rad', must be a number`
                    }, {
                        key: 'lat',
                        value: 91,
                        reason: `Field 'lat', must be in the range of [-90, 90]`,
                    }, {
                        key: 'lat',
                        value: -91,
                        reason: `Field 'lat', must be in the range of [-90, 90]`,
                    }, {
                        key: 'lon',
                        value: 181,
                        reason: `Field 'lon', must be in the range of [-180, 180]`
                    }, {
                        key: 'lon',
                        value: -181,
                        reason: `Field 'lon', must be in the range of [-180, 180]`
                    }, {
                        key: 'rad',
                        value: 0,
                        reason: `Field 'rad', must be in the range of [1, 500]`
                    }, {
                        key: 'rad',
                        value: 501,
                        reason: `Field 'rad', must be in the range of [1, 500]`
                    }
                ].forEach((testData) => {
                    it('should return 400: ' + testData.reason, async () => {
                        const query = {
                            lat: 1,
                            lon: 2,
                            rad: 3
                        };

                        if (testData.value === null) {
                            delete query[testData.key];
                        } else {
                            query[testData.key] = testData.value;
                        }

                        const request = {
                            query
                        } as express.Request;

                        const resp = mockResponse() as express.Response;

                        await airportsRoute.get(request, resp);
                        expect(resp.status).toHaveBeenCalledWith(400);
                        expect(resp.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: testData.reason
                        });
                    });
                });
            });

            describe('of next page query', () => {
                [
                    {
                        key: 'bookmark',
                        value: null,
                        reason: `Fields 'bookmark', 'query' and 'remainingPages' are required when 'prevQuery' is present`
                    }, {
                        key: 'remainingPages',
                        value: null,
                        reason: `Fields 'bookmark', 'query' and 'remainingPages' are required when 'prevQuery' is present`
                    }, {
                        key: 'query',
                        value: null,
                        reason: `Fields 'bookmark', 'query' and 'remainingPages' are required when 'prevQuery' is present`
                    }, {
                        key: 'query',
                        value: {latRange: null},
                        reason: `Fields 'latRange', 'lonRange', 'radius', 'latCentre' and 'lonCentre' are required in 'query'`
                    }, {
                        key: 'query',
                        value: {lonRange: null},
                        reason: `Fields 'latRange', 'lonRange', 'radius', 'latCentre' and 'lonCentre' are required in 'query'`
                    }, {
                        key: 'query',
                        value: {radius: null},
                        reason: `Fields 'latRange', 'lonRange', 'radius', 'latCentre' and 'lonCentre' are required in 'query'`
                    }, {
                        key: 'query',
                        value: {latCentre: null},
                        reason: `Fields 'latRange', 'lonRange', 'radius', 'latCentre' and 'lonCentre' are required in 'query'`
                    }, {
                        key: 'query',
                        value: {lonCentre: null},
                        reason: `Fields 'latRange', 'lonRange', 'radius', 'latCentre' and 'lonCentre' are required in 'query'`
                        }
                ].forEach((testData) => {
                    it(`${testData.key}: should return 400:  ${testData.reason}`, async () => {
                        const prevQueryObj = {
                            bookmark: 'bookmark',
                            remainingPages: 2,
                            query: {
                                latRange: [1, 3],
                                lonRange: [1, 3],
                                latCentre: 2,
                                lonCentre: 2,
                                radius: 100
                            }
                        };

                        if (testData.value === null) {
                            delete prevQueryObj[testData.key];
                        } else {
                            prevQueryObj[testData.key] = testData.value;
                        }

                        const request = {
                            query: {
                                prevQuery: JSON.stringify(prevQueryObj)
                            }
                        } as express.Request;

                        const resp = mockResponse() as express.Response;

                        await airportsRoute.get(request, resp);
                        expect(resp.status).toHaveBeenCalledWith(400);
                        expect(resp.json).toHaveBeenCalledWith({
                            status: 'error',
                            message: testData.reason
                        });
                    });
                });
            });
        });

        describe('searching', () => {
            const query = {
                rad: 1,
                lat: 2,
                lon: 3
            };

            const request = {
                query
            } as express.Request;

            it(`should call 'aiportsApi.search' with expected params when 'prevQuery' is not present`, () => {
                const resp = mockResponse() as express.Response;

                airportsRoute.get(request, resp);

                expect(mockAirportsApi.search).toHaveBeenCalledTimes(1);
                expect(mockAirportsApi.search).toHaveBeenCalledWith(2, 3, 1);
            });

            it(`should return 'aiportsApi.search's response`, async () => {
                const resp = mockResponse() as express.Response;

                await airportsRoute.get(request, resp);

                expect(resp.json).toHaveBeenCalledWith('api search response');
            });
        });

        describe('getting next page', () => {
            const prevQueryObj = {
                bookmark: 'bookmark',
                remainingPages: 6,
                query: {
                    latRange: [1, 3],
                    lonRange: [2, 5],
                    latCentre: 2,
                    lonCentre: 3,
                    radius: 100
                }
            };

            const request = {
                query: {
                    prevQuery: JSON.stringify(prevQueryObj)
                }
            } as express.Request;

            it(`should call 'aiportsApi.getNextPage' with expected params when 'prevQuery' is present`, () => {
                const resp = mockResponse() as express.Response;

                airportsRoute.get(request, resp);

                expect(mockAirportsApi.getNextPage).toHaveBeenCalledTimes(1);
                expect(mockAirportsApi.getNextPage).toHaveBeenCalledWith('bookmark', 6, [1, 3], [2, 5], 2, 3, 100);
            });

            it(`should return 'aiportsApi.getNextPage's response`, async () => {
                const resp = mockResponse() as express.Response;

                await airportsRoute.get(request, resp);

                expect(resp.json).toHaveBeenCalledWith('api getNextPage response');
            });
        });
    });
});
