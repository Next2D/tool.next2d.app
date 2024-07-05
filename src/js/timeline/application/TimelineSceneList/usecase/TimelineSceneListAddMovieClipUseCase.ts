import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineSceneListContentComponent } from "../component/TimelineSceneListContentComponent";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineSceneListNodeMouseDownEventUseCase } from "./TimelineSceneListNodeMouseDownEventUseCase";

/**
 * @description タイムラインのシーン名一覧に指定のMovieClipを追加する
 *              Add the specified MovieClip to the timeline scene name list
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    // movie_clipのelementを追加
    element.insertAdjacentHTML("beforeend",
        timelineSceneListContentComponent(movie_clip)
    );

    // movie_clipのIDを登録
    timelineSceneList.scenes.push(movie_clip.id);

    const node = element.lastElementChild as HTMLElement;
    if (!node) {
        return ;
    }

    node.addEventListener(EventType.MOUSE_DOWN,
        timelineSceneListNodeMouseDownEventUseCase
    );
};