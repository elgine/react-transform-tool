/* eslint-disable no-undef */
import distance, { distanceSelf } from '../src/maths/distance';

describe('Distance', () => {
    test('Should equal 5', () => {
        expect(distance({ x: 3, y: 0 }, { x: 0, y: 4 })).toEqual(5);
    });
});

describe('Distance self', () => {
    test('Should equal 5', () => {
        expect(distanceSelf(3, 4)).toEqual(5);
    });
});