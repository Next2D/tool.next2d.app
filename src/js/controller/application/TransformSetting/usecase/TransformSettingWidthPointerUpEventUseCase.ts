import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingWidthPointerMoveEventUseCase } from "./TransformSettingWidthPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { execute as transformSettingRestoreBeforeMatrixService } from "../service/TransformSettingRestoreBeforeMatrixService";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { $TRANSFORM_OBJECT_HEIGHT_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの幅の値操作のマウスアップイベント
 *              Mouse up event for value operation of width of deformation area
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
        transformSettingWidthPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 選択中のDisplayObjectを変更前の状態に戻す
    // fixed logic
    transformSettingRestoreBeforeMatrixService();

    // 変形に合わせて表示を更新
    const width = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 1, Number.MAX_VALUE);
    transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.beforeWidth);

    if (transformSetting.sizeLocked) {
        const heightElement = document
            .getElementById($TRANSFORM_OBJECT_HEIGHT_ID) as HTMLInputElement;
        if (!heightElement) {
            return ;
        }

        const height = $clamp(parseFloat(parseFloat(heightElement.value).toFixed(2)), 1, Number.MAX_VALUE);
        transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.beforeHeight);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // 変更前のmatrixを削除
    transformSetting.clear();

    // input要素のフォーカス
    element.focus();
};