import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingScaleXPointerMoveEventUseCase } from "./TransformSettingScaleXPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { execute as transformSettingRestoreBeforeMatrixService } from "../service/TransformSettingRestoreBeforeMatrixService";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { $TRANSFORM_OBJECT_SCALE_Y_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのxスケールの値操作のマウスアップイベント
 *              Mouse up event for value operation of x scale of deformation area
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
        transformSettingScaleXPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 選択中のDisplayObjectを変更前の状態に戻す
    // fixed logic
    transformSettingRestoreBeforeMatrixService();

    // 変形に合わせて表示を更新

    const scaleX = $clamp(Math.round(parseFloat(element.value) * 10000) / 10000, -Number.MAX_VALUE, Number.MAX_VALUE);
    transformSettingUpdateScaleXToElementValuesUseCase(scaleX / 100 / transformSetting.scaleX);

    if (transformSetting.scaleLocked) {
        const scaleYElement = document
            .getElementById($TRANSFORM_OBJECT_SCALE_Y_ID) as HTMLInputElement;
        if (!scaleYElement) {
            return ;
        }

        const scaleY = $clamp(Math.round(parseFloat(scaleYElement.value) * 10000) / 10000, -Number.MAX_VALUE, Number.MAX_VALUE);
        transformSettingUpdateScaleYToElementValuesUseCase(scaleY / 100 / transformSetting.scaleY);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // 変更前のmatrixを削除
    transformSetting.clear();

    // input要素のフォーカス
    element.focus();
};