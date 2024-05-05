import { $setCursor } from "@/global/GlobalUtil";
import { $getMovePositon } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingXWindowMouseMoveEventUseCase } from "./TransformSettingXWindowMouseMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";
import { $TRANSFORM_OBJECT_X_ID } from "@/config/TransformSettingConfig";

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

    // windowのイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        transformSettingXWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    // x座標の最終位置をセット
    screenDisplayObjectUpdateSelectedValueService();

    // input要素へフォーカス
    const element: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // input要素のフォーカス
    element.focus();
};