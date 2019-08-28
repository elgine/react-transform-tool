import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
    ROOT_STYLE_BASE,
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
import stylesx from './stylesx';

export interface TransformToolClassNames{
    root?: string;
    anchor?: {
        base?: string;
        rotator?: string;
        center?: string;
    };
}

export interface TransformToolStyles{
    root?: React.CSSProperties;
    anchor?: {
        center?: React.CSSProperties;
        base?: React.CSSProperties;
        rotator?: React.CSSProperties;
    };
}

export interface TransformToolProps extends Omit<React.HTMLAttributes<{}>, 'onChange' | 'className' | 'style'>{
    size: Size;
    value: Mat;
    classNames?: TransformToolClassNames;
    styles?: TransformToolStyles;
    onChange: (v: Mat) => void;
    offset?: {top: number;left: number};
}

export default ({
    classNames, styles,
    offset, size, value, onChange,
    ...others
}: TransformToolProps) => {
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
    const tempMatRef = useRef<Mat>(Matrix.create());

    useEffect(() => {
        if (Matrix.equals(matRef.current, value)) return;
        const mat = matRef.current;
        Matrix.clone(value, mat);

        const transform = {
            translation: [0, 0],
            scale: [1, 1],
            rotation: 0,
            skew: [0, 0]
        };
        Matrix.decompose(mat, transform);
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
            Matrix.clone(matRef.current, lastMatRef.current);
            const rel = { left: 0, top: 0 };
            if (rootRef.current && rootRef.current.parentElement) {
                const b = rootRef.current.parentElement.getBoundingClientRect();
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
                matrix: lastMatRef.current,
                downPos: anchorHook.downPos,
                curPos: anchorHook.curPos
            };
            Matrix.reset(tempMatRef.current);
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
            const m = tempMatRef.current;
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

    const clas = classNames || {};
    const anchorClassNameBase = clas.anchor ? clas.anchor.base : '';
    const anchorClassNameCenter = clas.anchor ? clas.anchor.center : '';
    const anchorClassNameRotator = clas.anchor ? clas.anchor.rotator : '';

    const stys = styles || {};
    const anchorStyleBase = stys.anchor ? stys.anchor.base : {};
    const anchorStyleCenter = stys.anchor ? stys.anchor.center : {};
    const anchorStyleRotator = stys.anchor ? stys.anchor.rotator : {};

    const rootStyle: React.CSSProperties = {
        ...ROOT_STYLE_BASE,
        ...stys.root,
        left: offset && offset.left,
        top: offset && offset.top,
        width: size.width * scale[0],
        height: size.height * scale[1],
        transformOrigin: 'left top',
        transform: `translate(${translation[0]}px, ${translation[1]}px) rotate(${toAngle(rotation)}deg)`
    };
    return (
        <div ref={rootRef} className={clas.root} style={rootStyle} {...others}>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_LEFT, stys.anchor)}
                onMouseDown={onAnchorDownGenerator('left')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_RIGHT, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('right')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_TOP, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('top')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_BOTTOM, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('bottom')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_TOP_LEFT, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('top-left')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_TOP_RIGHT, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('top-right')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_BOTTOM_LEFT, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('bottom-left')}></div>
            <div className={anchorClassNameBase}
                style={stylesx(ANCHOR_STYLE_BOTTOM_RIGHT, anchorStyleBase)}
                onMouseDown={onAnchorDownGenerator('bottom-right')}></div>
            <div className={clsx(anchorClassNameBase, anchorClassNameCenter)}
                style={stylesx(ANCHOR_STYLE_CENTER, anchorStyleBase, anchorStyleCenter)}
                onMouseDown={onAnchorDownGenerator('center')}></div>
            <div className={clsx(anchorClassNameBase, anchorClassNameRotator)}
                style={stylesx(ANCHOR_STYLE_ROTATOR, anchorStyleBase, anchorStyleRotator)}
                onMouseDown={onAnchorDownGenerator('rotator')}></div>
        </div>
    );
};