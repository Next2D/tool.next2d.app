import { Character } from "../core/domain/model/Character";
import { EmptyCharacter } from "../core/domain/model/EmptyCharacter";

export interface LayerObjectImpl
{
    name: string;
    light: boolean;
    disable: boolean;
    lock: boolean;
    mode: string;
    maskId: number;
    guideId: number;
    color: string;
    characters: Character[];
    emptyCharacters: EmptyCharacter[];
}