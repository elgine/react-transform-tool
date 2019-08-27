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

export const rotate = (params: ApplyParams) => {

};

export const scale = (params: ApplyParams) => {

};

export const translate = (params: ApplyParams) => {
    const { curPos, downPos, translation } = params;
    translation[0] += curPos.x - downPos.x;
    translation[1] += curPos.y - downPos.y;
};