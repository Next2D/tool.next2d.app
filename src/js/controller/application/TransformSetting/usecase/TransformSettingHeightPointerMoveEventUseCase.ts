import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleXToElementValuesUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの幅の値操作のマウスムーブイベント
 *              Mouse move event for value operation of width of deformation area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const value  = parseFloat(parseFloat(element.value).toFixed(2));
        const height = $clamp(value + event.movementX, 1, Number.MAX_VALUE);
        element.value = `${height}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.h);
        transformSetting.h = height;

        if (transformSetting.sizeLocked) {
            const widthElement = document
                .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;
            if (!widthElement) {
                return ;
            }

            const value = parseFloat(parseFloat(widthElement.value).toFixed(2));
            const width = $clamp(value + event.movementX, 1, Number.MAX_VALUE);
            widthElement.value = `${width}`;

            transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.w);
            transformSetting.w = width;
        }
    });
};