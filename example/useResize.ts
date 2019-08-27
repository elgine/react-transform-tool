import { useEffect, useMemo, useState } from 'react';

export default (dom: HTMLElement|null, interval: number = 100) => {
    dom = dom || document.body;
    const [lastWidth, setLastWidth] = useState(dom ? dom.offsetWidth : 0);
    const [lastHeight, setLastHeight] = useState(dom ? dom.offsetHeight : 0);
    const onResize = useMemo(() => {
        return () => {
            if (dom) {
                let width = dom.offsetWidth;
                let height = dom.offsetHeight;
                if (width === lastWidth && height === lastHeight) return;
                setLastWidth(width);
                setLastHeight(height);
            }
        };
    }, [dom]);
    useEffect(() => {
        const timer = window.setInterval(onResize, interval);
        return () => {
            window.clearInterval(timer);
        };
    }, [onResize, interval]);
    useEffect(onResize, [onResize]);
    return {
        width: lastWidth,
        height: lastHeight
    };
};