import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingYPointerMoveEventUseCase } from "./TransformSettingYPointerMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";

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

    // x座標の最終位置をセット
    screenDisplayObjectUpdateSelectedValueService();

    // input要素のフォーカス
    element.focus();
};