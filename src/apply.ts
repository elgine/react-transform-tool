export interface ApplyParams{
    anchorType: AnchorType;
    size: Size;
    relative: {left: number; top: number};
    offset: {left: number; top: number};
    downPos: Point;
    curPos: Point;

    translation: Vec;
    scale: Vec;
    rotation: number;
}

export const applyRotate = (params: ApplyParams) => {

};

export const applyScale = (params: ApplyParams) => {

};

export const applyTranslate = (params: ApplyParams) => {
    const { curPos, downPos, translation } = params;
    translation[0] += curPos.x - downPos.x;
    translation[1] += curPos.y - downPos.y;
};