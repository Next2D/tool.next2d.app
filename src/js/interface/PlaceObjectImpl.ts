import type { IFilterPublishObject } from "./IFilterPublishObject";
import type { LoopObjectImpl } from "./LoopObjectImpl";

export interface PlaceObjectImpl {
    matrix?: number[];
    colorTransform?: number[];
    blendMode?: string;
    surfaceFilterList?: IFilterPublishObject[];
    loop?: LoopObjectImpl;
}