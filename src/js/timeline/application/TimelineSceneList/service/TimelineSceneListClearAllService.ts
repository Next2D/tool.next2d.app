import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";

/**
 * @description タイムラインのシーン名一覧を初期化
 *              Initialize the list of scene names in the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if (!timelineSceneList.scenes.length) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    // 全てのelementを削除
    while (element.children.length) {
        element.children[0].remove();
    }

    // 内部情報も初期化
    timelineSceneList.scenes.length = 0;
};