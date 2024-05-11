import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingWidthWindowMouseMoveEventUseCase } from "./TransformSettingWidthWindowMouseMoveEventUseCase";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";
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

    // windowのイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        transformSettingWidthWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;

    // input要素へフォーカス
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // input要素のフォーカス
    element.focus();
};