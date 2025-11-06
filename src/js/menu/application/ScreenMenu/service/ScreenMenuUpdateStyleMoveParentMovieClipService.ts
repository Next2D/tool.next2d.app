import { $SCREEN_MOVE_SCENE_ID } from "@/config/ScreenConfig";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description MovieClipの親移動ボタンのスタイル更新
 *              Update the style of the parent move button for the movie clip
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 単独選択時の表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_MOVE_SCENE_ID) as HTMLElement;
    if (!element) {
        return ;
    }

    if (timelineSceneList.parents.length) {
        element.setAttribute("style", "");
    } else {
        element.style.opacity = "0.5";
        element.style.pointerEvents = "none";
    }
};