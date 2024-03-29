const ANCHOR_SIZE = 15;
const COLOR = '#fff';
export const ANCHOR_STYLE_BASE: React.CSSProperties = {
    position: 'absolute',
    width: ANCHOR_SIZE,
    height: ANCHOR_SIZE,
    borderRadius: '50%',
    backgroundColor: COLOR,
    cursor: 'pointer',
    marginLeft: -ANCHOR_SIZE * 0.5,
    marginTop: -ANCHOR_SIZE * 0.5,
    boxShadow: `0 3px 6px rgba(0,0,0,0.23)`
};

export const ANCHOR_STYLE_LEFT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '50%',
    left: 0
};

export const ANCHOR_STYLE_TOP: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: 0,
    left: '50%'
};

export const ANCHOR_STYLE_RIGHT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '50%',
    left: '100%'
};

export const ANCHOR_STYLE_BOTTOM: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '100%',
    left: '50%'
};

export const ANCHOR_STYLE_CENTER: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '50%',
    left: '50%'
};

export const ANCHOR_STYLE_ROTATOR: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '100%',
    left: '100%',
    marginLeft: ANCHOR_SIZE,
    marginTop: ANCHOR_SIZE
};

export const ANCHOR_STYLE_TOP_LEFT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: 0,
    left: 0
};

export const ANCHOR_STYLE_TOP_RIGHT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: 0,
    left: '100%'
};

export const ANCHOR_STYLE_BOTTOM_LEFT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '100%',
    left: 0
};

export const ANCHOR_STYLE_BOTTOM_RIGHT: React.CSSProperties = {
    ...ANCHOR_STYLE_BASE,
    top: '100%',
    left: '100%'
};

export const ROOT_STYLE_BASE: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box'
};