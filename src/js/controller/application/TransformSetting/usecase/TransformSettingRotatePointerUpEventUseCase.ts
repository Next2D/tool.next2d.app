import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingRotatePointerMoveEventUseCase } from "./TransformSettingRotatePointerMoveEventUseCase";
import { execute as transformSettingUpdateRotateToRedrawCanvasUseCase } from "./TransformSettingUpdateRotateToRedrawCanvasUseCase";

/**
 * @description 変形エリアの回転の値操作のマウスアップイベント
 *              Mouse up event for value operation of rotation of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
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
        transformSettingRotatePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 変形に合わせて表示を更新
    await transformSettingUpdateRotateToRedrawCanvasUseCase();

    // input要素のフォーカス
    element.focus();
};