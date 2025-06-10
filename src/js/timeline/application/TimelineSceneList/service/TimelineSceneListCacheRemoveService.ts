import { $removeLibraryCache } from "@/cache/CacheUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description 先祖のキャッシュを削除するユースケース
 *              Use case to delete ancestor cache
 *
 * @param  {number} work_space_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space_id: number): void =>
{
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
        $removeLibraryCache(work_space_id, character.libraryId);
    }
};