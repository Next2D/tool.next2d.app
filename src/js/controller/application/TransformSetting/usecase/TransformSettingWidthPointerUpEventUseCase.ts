import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingWidthWindowMouseMoveEventUseCase } from "./TransformSettingWidthPointerMoveEventUseCase";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

/**
 * @description 変形エリアの幅の値操作のマウスアップイベント
 *              Mouse up event for value operation of width of deformation area
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
        transformSettingWidthWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;

    // input要素のフォーカス
    element.focus();
};