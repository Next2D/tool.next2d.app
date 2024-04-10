import type { BlendModeImpl } from "./BlendModeImpl";

export interface CharacterSaveObjectImpl {
    id: number;
    libraryId: number;
    depth: number;
    blendMode: BlendModeImpl;
    matrix: number[];
    colorTransform: number[];
    startFrame: number;
    endFrame: number;
}