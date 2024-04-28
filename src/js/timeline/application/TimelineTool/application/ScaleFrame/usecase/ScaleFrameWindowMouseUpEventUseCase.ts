import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { execute as stageSettingFpsWindowMouseMoveEventUseCase } from "./ScaleFrameWindowMouseMoveEventUseCase";
import { $TIMELINE_SCROLL_ID } from "@/config/TimelineConfig";

/**
 * @description フレームのスケール設定の数値変更のマウスアップイベント
 *              Mouse up event for changing the numerical value of the frame scale setting
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    // windowのイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        stageSettingFpsWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const element: HTMLInputElement | null = document
        .getElementById($TIMELINE_SCROLL_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // input要素のフォーカス
    element.focus();
};