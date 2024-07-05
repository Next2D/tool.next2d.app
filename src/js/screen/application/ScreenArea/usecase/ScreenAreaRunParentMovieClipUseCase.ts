import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";

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

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    const node = element.lastElementChild as HTMLElement;
    if (!node) {
        return ;
    }

    // 対象のelementを削除
    node.remove();

    const libraryId = timelineSceneList.scenes.pop() as NonNullable<number>;
    const workSpace = $getCurrentWorkSpace();
    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    // 指定のMovieClipを起動
    await externalTimelineEditMovieClipUseService(workSpace, movieClip);
};