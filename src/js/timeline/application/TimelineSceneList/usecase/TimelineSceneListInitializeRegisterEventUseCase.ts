import { $TIMELINE_SCENE_LIST_BUTTON_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineSceneListMouseDownEventUseCase } from "./TimelineSceneListMouseDownEventUseCase";

/**
 * @description タイムラインの親のシーン名一覧ボタンにイベント登録
 *              Register events in the parent scene name list button on the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_LIST_BUTTON_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineSceneListMouseDownEventUseCase
    );
};