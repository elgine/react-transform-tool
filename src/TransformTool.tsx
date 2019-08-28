import React, { useState, useRef, useEffect } from 'react';
import {
    ROOT_STYLE_BASE,
    ANCHOR_STYLE_BASE,
    ANCHOR_STYLE_LEFT,
    ANCHOR_STYLE_RIGHT,
    ANCHOR_STYLE_TOP,
    ANCHOR_STYLE_BOTTOM,
    ANCHOR_STYLE_CENTER,
    ANCHOR_STYLE_TOP_LEFT,
    ANCHOR_STYLE_TOP_RIGHT,
    ANCHOR_STYLE_BOTTOM_LEFT,
    ANCHOR_STYLE_BOTTOM_RIGHT,
    ANCHOR_STYLE_ROTATOR
} from './styles';
import useMovement from './hooks/useMovement';
import Matrix from './maths/matrix';
import { applyRotate, applyTranslate, applyScale } from './apply';
import { toAngle } from './maths/angRad';

export interface TransformToolProps extends Omit<React.HTMLAttributes<{}>, 'onChange'>{
    size: Size;
    value: Mat;
    onChange: (v: Mat) => void;
    offset?: {top: number;left: number};
}

export default ({ offset, size, value, onChange, style, ...others }: TransformToolProps) => {
    const o = offset || { left: 0, top: 0 };
    const rootRef = useRef<HTMLDivElement>(null);
    const [translation, setTranslation] = useState([0, 0]);
    const [scale, setScale] = useState([1, 1]);
    const [rotation, setRotation] = useState(0);

    // Cache the latest state
    const [lastTranslation, setLastTranslation] = useState([0, 0]);
    const [lastScale, setLastScale] = useState([1, 1]);
    const [lastRotation, setLastRotation] = useState(0);
    const [relative, setRelative] = useState({ left: 0, top: 0 });
    const [anchorType, setAnchorType] = useState<AnchorType>('left');

    // Reference
    const lastMatRef = useRef<Mat>(Matrix.create());
    const matRef = useRef<Mat>(Matrix.create());

    useEffect(() => {
        if (Matrix.equals(lastMatRef.current, value)) return;
        const lastMat = lastMatRef.current;
        Matrix.clone(value, lastMat);

        const transform = {
            translation: [0, 0],
            scale: [1, 1],
            rotation: 0,
            skew: [0, 0]
        };
        Matrix.decompose(lastMat, transform);
        setTranslation(transform.translation);
        setScale(transform.scale);
        setRotation(transform.rotation || transform.skew[1]);
    }, [value]);

    const anchorHook = useMovement();
    const onAnchorDownGenerator = (type: AnchorType) => {
        return (e: React.MouseEvent) => {
            anchorHook.onMouseDown(e);
            setAnchorType(type);
            setLastTranslation(translation.slice());
            setLastScale(scale.slice());
            setLastRotation(rotation);
            const rel = { left: 0, top: 0 };
            if (rootRef.current) {
                const b = rootRef.current.getBoundingClientRect();
                rel.left = b.left;
                rel.top = b.top;
            }
            setRelative(rel);
        };
    };
    useEffect(() => {
        if (anchorHook.hasDown && anchorHook.isDragging) {
            const params = {
                anchorType,
                relative,
                offset: o,
                translation: lastTranslation.slice(),
                scale: lastScale.slice(),
                rotation: lastRotation,
                size,
                downPos: anchorHook.downPos,
                curPos: anchorHook.curPos
            };
            // Apply rotation
            if (anchorType === 'rotator') {
                applyRotate(params);
            }
            // Apply translation
            else if (anchorType === 'center') {
                applyTranslate(params);
            }
            // Apply scale
            else {
                applyScale(params);
            }

            const m = matRef.current;
            Matrix.recompose({
                translation: params.translation,
                scale: params.scale,
                rotation: params.rotation,
                skew: [0, 0]
            }, [0, 0], m);
            onChange(m.slice());
        }
    }, [
        anchorHook.hasDown,
        anchorHook.isDragging,
        anchorHook.downPos,
        anchorHook.curPos,
        anchorType,
        relative,
        o,
        lastTranslation,
        lastScale,
        lastRotation,
        size,
        onChange
    ]);

    const rootStyle: React.CSSProperties = {
        ...ROOT_STYLE_BASE,
        ...style,
        left: offset && offset.left,
        top: offset && offset.top,
        width: size.width * scale[0],
        height: size.height * scale[1],
        transformOrigin: 'left top',
        transform: `translate(${translation[0]}px, ${translation[1]}px) rotate(${toAngle(rotation)}deg)`
    };
    return (
        <div ref={rootRef} style={rootStyle} {...others}>
            <div style={ANCHOR_STYLE_LEFT} onMouseDown={onAnchorDownGenerator('left')}></div>
            <div style={ANCHOR_STYLE_RIGHT} onMouseDown={onAnchorDownGenerator('right')}></div>
            <div style={ANCHOR_STYLE_TOP} onMouseDown={onAnchorDownGenerator('top')}></div>
            <div style={ANCHOR_STYLE_BOTTOM} onMouseDown={onAnchorDownGenerator('bottom')}></div>
            <div style={ANCHOR_STYLE_TOP_LEFT} onMouseDown={onAnchorDownGenerator('top-left')}></div>
            <div style={ANCHOR_STYLE_TOP_RIGHT} onMouseDown={onAnchorDownGenerator('top-right')}></div>
            <div style={ANCHOR_STYLE_BOTTOM_LEFT} onMouseDown={onAnchorDownGenerator('bottom-left')}></div>
            <div style={ANCHOR_STYLE_BOTTOM_RIGHT} onMouseDown={onAnchorDownGenerator('bottom-right')}></div>
            <div style={ANCHOR_STYLE_CENTER} onMouseDown={onAnchorDownGenerator('center')}></div>
            <div style={ANCHOR_STYLE_ROTATOR} onMouseDown={onAnchorDownGenerator('rotator')}></div>
        </div>
    );
};