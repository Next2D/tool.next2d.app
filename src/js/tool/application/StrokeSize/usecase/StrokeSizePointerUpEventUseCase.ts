import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as strokeSizePointerMoveEventUseCase } from "../service/StrokeSizePointerMoveEventService";
import { execute as userStrokeSizeUpdateService } from "@/user/application/Tool/service/UserStrokeSizeUpdateService";
import { strokeSize } from "@/tool/domain/model/StrokeSize";

/**
 * @description 変形エリアのx座標の値操作のマウスアップイベント
 *              Mouse up event for value operation of x-coordinate of deformation area
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

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE,
        strokeSizePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 線の太さを更新
    strokeSize.value = parseInt(element.value);
    userStrokeSizeUpdateService(strokeSize.value);

    // input要素のフォーカス
    element.focus();
};