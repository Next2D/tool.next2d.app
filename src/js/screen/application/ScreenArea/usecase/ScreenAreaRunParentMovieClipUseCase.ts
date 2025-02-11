import type { MovieClip } from "@/core/domain/model/MovieClip";
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
    if (!timelineSceneList.parents.length) {
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

    const parentObject = timelineSceneList.parents.pop();
    if (!parentObject) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.getLibrary(parentObject.parentLibraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    // 対象のelementを削除
    node.remove();

    // 指定のMovieClipを起動
    await externalTimelineEditMovieClipUseService(workSpace, movieClip);
};