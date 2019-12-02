 /*
 Tests for the geo helper.
 If it weren't a coding test, I wouldn't use unit tests for the helpers.
 No need to automatically rerun the tests when the other parts of the code are changed.
 Helpers are isolated (we test the other parts of the code if they are calling them), we need to know only once if they're working as expected.
 I'm not testing here the math, only the logic
 Integration test for the math?
 */

import geo from '../helpers/geo';

describe('geo helper', () => {
    describe('getLatitudeRange', () => {
        it('should return a range', () => {
            const latitudeRange = geo.getLatitudeRange(0, 224);
            expect(latitudeRange).toEqual([-2, 2]);
        });

        it('should handle latitude ranges over 90', () => {
            const latitudeRange = geo.getLatitudeRange()
        });
    })
});
