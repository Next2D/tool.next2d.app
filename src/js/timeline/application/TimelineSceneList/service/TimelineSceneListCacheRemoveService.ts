import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $removeLibraryCache } from "@/cache/CacheUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description 先祖のキャッシュを削除するユースケース
 *              Use case to delete ancestor cache
 *
 * @param  {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): void =>
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

        const instance = work_space.getLibrary(character.libraryId);
        if (!instance || instance.type !== $MOVIE_CLIP_TYPE) {
            continue;
        }

        // キャッシュを削除
        $removeLibraryCache(work_space.id, character.libraryId);
    }
};