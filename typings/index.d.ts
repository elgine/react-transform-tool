/* eslint-disable @typescript-eslint/class-name-casing */
type AnyOf<T> = {
    [K in keyof T]?: T[K];
};

type ValueType<T extends keyof V, V> = V[T];

interface Dictionary<T> {[name: string]: T}

type Constructor<T> = new (...args: any[]) => T;

type Mat = number[];
type Vec = number[];

type AnchorType = 'left' | 'top' | 'right' | 'bottom' | 'center' | 'rotator' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface Transform {
    translation: number[];
    scale: number[];
    rotation: number;
    skew: number[];
}

interface Point{
    x: number;
    y: number;
}

interface Size{
    width: number;
    height: number;
}

interface BaseComponentProps{
    className?: string;
    style?: React.CSSProperties;
}