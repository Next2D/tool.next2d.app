import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";
import { execute as transformSettingHeightPointerMoveEventUseCase } from "./TransformSettingHeightPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingRestoreBeforeMatrixService } from "../service/TransformSettingRestoreBeforeMatrixService";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";

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
        transformSettingHeightPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 選択中のDisplayObjectを変更前の状態に戻す
    // fixed logic
    transformSettingRestoreBeforeMatrixService();

    // 変形に合わせて表示を更新
    const height = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 1, Number.MAX_VALUE);
    transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.beforeValue);

    if (transformSetting.sizeLocked) {
        const widthElement = document
            .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;
        if (!widthElement) {
            return ;
        }

        const value = parseFloat(parseFloat(widthElement.value).toFixed(2));
        const width = $clamp(value + event.movementX, 1, Number.MAX_VALUE);
        widthElement.value = `${width}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.lockValue);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;

    // input要素のフォーカス
    element.focus();
};