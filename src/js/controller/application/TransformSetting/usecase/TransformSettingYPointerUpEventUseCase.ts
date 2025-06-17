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
        transformSettingYPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    // y座標に変更があれば、最終位置をセット
    await screenDisplayObjectUpdateSelectedValueService();

    // 変形設定の値をクリア
    transformSetting.clear();

    // input要素のフォーカス
    element.focus();
};