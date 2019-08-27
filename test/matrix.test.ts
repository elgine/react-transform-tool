/* eslint-disable no-undef */
import MyMatrix from '../src/maths/matrix';
import { Matrix } from 'pixi.js';

describe('matrix & pixi-matrix', () => {
    test('rotation', () => {
        const pixiMat = new Matrix();
        pixiMat.set(
            1, 0,
            0, 1,
            0, 0
        );

        const mat = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];

        pixiMat.rotate(Math.PI * 0.45);
        MyMatrix.rotate(mat, Math.PI * 0.45);

        expect(mat).toStrictEqual(pixiMat.toArray(false));
    });
});
