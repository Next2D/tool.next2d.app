import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingXPointerMoveEventUseCase } from "./ReferenceSettingXPointerMoveEventUseCase";

/**
 * @description 中心点エリアのx座標の値操作のポインタアップイベント
 *              Pointer up event for value operation of x-coordinate of center point area
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

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        referenceSettingXPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    // input要素のフォーカス
    element.focus();
};