import type { IBlendMode } from "./IBlendMode";
import type { PositionImpl } from "./PositionImpl";

export interface ICharacterSaveObject {
    libraryId: number;
    depth: number;
    blendMode: IBlendMode;
    matrix: number[];
    colorTransform: number[];
    startFrame: number;
    endFrame: number;
    name: string;
    referencePosition: PositionImpl
}