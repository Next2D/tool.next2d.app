import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { execute as timelineSceneListExcludeElememtService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListExcludeElememtService";

/**
 * @description 一つ上の親のMovieClipに切り替える
 *              Switch to the parent MovieClip one level above.
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // mainのMovieClipなら何もしない
    if (!timelineSceneList.scenes.length) {
        return ;
    }

    const libraryId = timelineSceneList.scenes.pop() as NonNullable<number>;
    const workSpace = $getCurrentWorkSpace();
    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    // 指定のIDまでシーン名一覧を更新
    timelineSceneListExcludeElememtService(libraryId);

    // 指定のMovieClipを起動
    const externalWorkSpace = new ExternalWorkSpace(workSpace);
    await externalWorkSpace.runMovieClip(new ExternalMovieClip(
        workSpace, movieClip
    ));
};