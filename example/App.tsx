import React, { useState, useLayoutEffect, useEffect } from 'react';
import TransformTool from '../src/TransformTool';
import useResize from './useResize';

const RECT_SIZE = {
    width: 120,
    height: 120
};

const ROOT_STYLE: React.CSSProperties = {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
};

const CANVAS_STYLE: React.CSSProperties = {
    position: 'absolute'
};

export default () => {
    const [resolution, setResolution] = useState([1024, 768]);
    const [offset, setOffset] = useState({ left: 0, top: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [matrix, setMatrix] = useState([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);
    const ratio = resolution[0] / resolution[1];
    const pageSize = useResize(null);
    useLayoutEffect(() => {
        if (canvas) {
            if (canvas.parentElement) {
                let maxHeight = canvas.parentElement.clientHeight;
                let maxWidth  = canvas.parentElement.clientWidth;
                let w = 0;
                let h = 0;
                if (ratio * maxHeight <= maxWidth) {
                    w = ~~(ratio * maxHeight);
                    h = ~~maxHeight;
                } else {
                    w = ~~maxWidth;
                    h = ~~(maxWidth / ratio);
                }
                setCanvasSize({
                    width: w,
                    height: h
                });
                setOffset({
                    left: (maxWidth - w) * 0.5,
                    top: (maxHeight - h) * 0.5
                });
            }
        }
    }, [canvas, ratio, pageSize.width, pageSize.height]);

    useEffect(() => {
        if (canvas) {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
        }
    }, [canvasSize, canvas]);

    useEffect(() => {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.setTransform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
            ctx.fillRect(0, 0, RECT_SIZE.width, RECT_SIZE.height);
            ctx.restore();
        }
    }, [canvas, matrix, canvasSize]);

    const canvasStyle: React.CSSProperties = {
        ...CANVAS_STYLE,
        left: offset.left,
        top: offset.top
    };
    return (
        <div style={ROOT_STYLE}>
            <canvas ref={setCanvas} style={canvasStyle}></canvas>
            <TransformTool offset={offset} size={RECT_SIZE} value={matrix} onChange={setMatrix} />
        </div>
    );
};