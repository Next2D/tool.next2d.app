import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $setColorSettingState } from "../ColorSettingUtil";
import { execute as colorSettingAlphaMultiplierPointerMoveUseCase } from "./ColorSettingAlphaMultiplierPointerMoveUseCase";

/**
 * @description カラー設定エリアのアルファマルチプライヤー変更のポインターアップイベント
 *              Pointer up event for changing the alpha multiplier of the color setting area
 *
 * @param {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 変形の状態を変更
    $setColorSettingState("up");

    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        colorSettingAlphaMultiplierPointerMoveUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // input要素のフォーカス
    element.focus();
};