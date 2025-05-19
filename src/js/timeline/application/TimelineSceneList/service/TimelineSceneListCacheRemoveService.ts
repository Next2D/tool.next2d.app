import { $removeLibraryCache } from "@/cache/CacheUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description 先祖のキャッシュを削除するユースケース
 *              Use case to delete ancestor cache
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    for (let idx = 0; idx < timelineSceneList.parents.length; idx++) {

        const parentObject = timelineSceneList.parents[idx];
        if (!parentObject) {
            continue;
        }

        const character = parentObject.selectCharacter;
        if (!character) {
            continue;
        }

        // キャッシュを削除
        $removeLibraryCache(workSpace.id, character.libraryId);
    }
};