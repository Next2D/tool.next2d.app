import type { IFilterPublishObject } from "./IFilterPublishObject";
import type { ILoopObject } from "./ILoopObject";

export interface IPlaceObject {
    matrix?: number[];
    colorTransform?: number[];
    blendMode?: string;
    surfaceFilterList?: IFilterPublishObject[];
    loop?: ILoopObject;
}