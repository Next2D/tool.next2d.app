import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description 一つ上の親のMovieClipに切り替える
 *              Switch to the parent MovieClip one level above.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
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

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    const node = element.lastElementChild as HTMLElement;
    if (!node) {
        return ;
    }

    node.remove();
};