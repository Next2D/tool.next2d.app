import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingYPointerMoveEventUseCase } from "./TransformSettingYPointerMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

/**
 * @description 変形エリアのy座標の値操作のマウスアップイベント
 *              Mouse up event for value operation of y-coordinate of deformation area
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
        transformSettingYPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // y座標に変更があれば、最終位置をセット
    if (transformSetting.y) {
        transformSetting.y = transformSetting.y - transformSetting.tempPosition.y;
    }
    screenDisplayObjectUpdateSelectedValueService();

    // input要素のフォーカス
    element.focus();
};