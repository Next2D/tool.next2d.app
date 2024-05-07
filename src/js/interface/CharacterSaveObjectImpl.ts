import type { BlendModeImpl } from "./BlendModeImpl";
import type { PositionImpl } from "./PositionImpl";

export interface CharacterSaveObjectImpl {
    libraryId: number;
    depth: number;
    blendMode: BlendModeImpl;
    matrix: number[];
    colorTransform: number[];
    startFrame: number;
    endFrame: number;
    name: string;
    referencePosition: PositionImpl
}