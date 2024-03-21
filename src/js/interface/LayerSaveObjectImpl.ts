import type { LayerModeImpl } from "./LayerModeImpl";
import type { CharacterSaveObjectImpl } from "./CharacterSaveObjectImpl";
import type { EmptyCharacterSaveObjectImpl } from "./EmptyCharacterSaveObjectImpl";

export interface LayerSaveObjectImpl {
    name: string;
    color: string;
    lock: boolean;
    disable: boolean;
    light: boolean;
    mode: LayerModeImpl;
    characters: CharacterSaveObjectImpl[];
    emptyCharacters: EmptyCharacterSaveObjectImpl[];
    parentIndex?: null | number;
    maskId?: null | number;
    guideId?: null | number;
}