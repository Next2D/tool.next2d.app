import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { execute as timelineSceneListContentComponent } from "../component/TimelineSceneListContentComponent";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineSceneListNodeMouseDownEventUseCase } from "./TimelineSceneListNodeMouseDownEventUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインのシーン名一覧に指定のMovieClipを追加する
 *              Add the specified MovieClip to the timeline scene name list
 *
 * @param  {number} library_id
 * @param  {number} depth
 * @param  {array} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number, depth: number, matrix: number[]): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // movie_clipのelementを追加
    element.insertAdjacentHTML("beforeend",
        timelineSceneListContentComponent(movieClip)
    );

    // movie_clipのIDを登録
    timelineSceneList.parents.push({
        "libraryId": library_id,
        "depth": depth,
        "matrix": matrix
    });

    const node = element.lastElementChild as HTMLElement;
    if (!node) {
        return ;
    }

    // イベントを登録
    node.addEventListener(EventType.MOUSE_DOWN,
        timelineSceneListNodeMouseDownEventUseCase
    );
};