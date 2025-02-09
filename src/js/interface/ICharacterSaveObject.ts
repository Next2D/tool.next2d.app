import type { IBlendMode } from "./IBlendMode";
import type { IPosition } from "./IPosition";

export interface ICharacterSaveObject {
    libraryId: number;
    depth: number;
    blendMode: IBlendMode;
    matrix: number[];
    colorTransform: number[];
    startFrame: number;
    endFrame: number;
    name: string;
    referencePosition: IPosition
}