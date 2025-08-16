import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";
import { execute as transformSettingHeightPointerMoveEventUseCase } from "./TransformSettingHeightPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
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

    // 変形に合わせて表示を更新
    const height = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        1, Number.MAX_VALUE
    );

    const scale = height / transformSetting.beforeHeight;
    transformSettingUpdateScaleYToElementValuesUseCase(scale);

    if (transformSetting.sizeLocked) {
        const widthElement = document
            .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;
        if (!widthElement) {
            return ;
        }

        const width = $clamp(
            Math.round(parseFloat(widthElement.value) * scale * 100) / 100,
            1, Number.MAX_VALUE
        );
        widthElement.value = `${width}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleXToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // input要素のフォーカス
    element.focus();
};