import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingXPointerMoveEventUseCase } from "./TransformSettingXPointerMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateSelectedValueService";

/**
 * @description 変形エリアのx座標の値操作のマウスアップイベント
 *              Mouse up event for value operation of x-coordinate of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
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
    element.removeEventListener(EventType.POINTER_MOVE,
        transformSettingXPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);

    // x座標に変更があれば、最終位置をセット
    await screenDisplayObjectUpdateSelectedValueService();

    // input要素のフォーカス
    element.focus();
};