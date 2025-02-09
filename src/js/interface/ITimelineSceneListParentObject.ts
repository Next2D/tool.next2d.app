import { Character } from "@/core/domain/model/Character";

export interface ITimelineSceneListParentObject {
    parentLibraryId: number;
    selectCharacter: Character | null;
}