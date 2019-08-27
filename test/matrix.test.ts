/* eslint-disable no-undef */
import MyMatrix from '../src/maths/matrix';
import { Matrix } from '@pixi/math';

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
        expect(MyMatrix.equals(pixiMat.toArray(false), mat)).toBe(true);
    });

    test('compose', () => {
        const tx = 20;
        const ty = 20;
        const sx = 1.2;
        const sy = 2;
        const r = Math.PI / 3;
        const skx = 0;
        const sky = 0;

        const pixiMat = new Matrix();
        pixiMat.setTransform(
            tx, ty,
            0, 0,
            sx, sy,
            r,
            skx, sky
        );

        const mat = MyMatrix.create();
        MyMatrix.recompose({
            translation: [tx, ty],
            scale: [sx, sy],
            rotation: r,
            skew: [skx, sky]
        }, [0, 0], mat);

        expect(MyMatrix.equals(pixiMat.toArray(false), mat)).toBe(true);
    });

    test('decompose', () => {

    });
});
