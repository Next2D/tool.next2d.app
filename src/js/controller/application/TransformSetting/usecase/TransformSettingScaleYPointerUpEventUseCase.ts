import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingScaleYPointerMoveEventUseCase } from "./TransformSettingScaleYPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { execute as transformSettingRestoreBeforeMatrixService } from "../service/TransformSettingRestoreBeforeMatrixService";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { $TRANSFORM_OBJECT_SCALE_X_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのyスケールの値操作のマウスアップイベント
 *              Mouse up event for value operation of y scale of deformation area
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
        transformSettingScaleYPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 選択中のDisplayObjectを変更前の状態に戻す
    // fixed logic
    transformSettingRestoreBeforeMatrixService();

    // 変形に合わせて表示を更新
    const scaleY = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
    );
    transformSettingUpdateScaleYToElementValuesUseCase(scaleY / 100 / transformSetting.scaleY);

    if (transformSetting.scaleLocked
        && transformSetting.scaleX
    ) {
        const scaleXElement = document
            .getElementById($TRANSFORM_OBJECT_SCALE_X_ID) as HTMLInputElement;
        if (!scaleXElement) {
            return ;
        }

        const scaleX = $clamp(
            Math.round(parseFloat(scaleXElement.value) * 100) / 100,
            Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
        );
        transformSettingUpdateScaleXToElementValuesUseCase(scaleX / 100 / transformSetting.scaleX);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // input要素のフォーカス
    element.focus();
};