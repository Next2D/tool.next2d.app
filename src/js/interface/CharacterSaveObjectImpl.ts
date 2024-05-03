import type { BlendModeImpl } from "./BlendModeImpl";

export interface CharacterSaveObjectImpl {
    libraryId: number;
    depth: number;
    blendMode: BlendModeImpl;
    matrix: number[];
    colorTransform: number[];
    startFrame: number;
    endFrame: number;
    name: string;
}