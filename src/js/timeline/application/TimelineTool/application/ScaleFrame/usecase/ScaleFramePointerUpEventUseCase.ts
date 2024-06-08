import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { execute as stageSettingFpsWindowMouseMoveEventUseCase } from "./ScaleFramePointerMoveEventUseCase";

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
    // カーソルを変更
    $setCursor("auto");

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE,
        stageSettingFpsWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // input要素のフォーカス
    element.focus();
};