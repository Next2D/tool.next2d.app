import type { FilterPublishObjectImpl } from "./FilterPublishObjectImpl";
import type { LoopObjectImpl } from "./LoopObjectImpl";

export interface PlaceObjectImpl {
    matrix?: number[];
    colorTransform?: number[];
    blendMode?: string;
    surfaceFilterList?: FilterPublishObjectImpl[];
    loop?: LoopObjectImpl;
}