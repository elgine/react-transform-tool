export default (...styles: (Function | object | undefined)[]) => {
    return styles.reduce((style: React.CSSProperties, styleValue) => {
        return styleValue ? (Object.assign(style, typeof styleValue === 'function' ? styleValue() : styleValue)) : style;
    }, {} as React.CSSProperties);
};