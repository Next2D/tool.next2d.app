import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { $TRANSFORM_OBJECT_HEIGHT_ID } from "@/config/TransformSettingConfig";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

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
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const width = $clamp(value + event.movementX, 1, Number.MAX_VALUE);
        element.value = `${width}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.w);
        transformSetting.w = width;

        if (transformSetting.sizeLocked) {
            const heightElement = document
                .getElementById($TRANSFORM_OBJECT_HEIGHT_ID) as HTMLInputElement;
            if (!heightElement) {
                return ;
            }

            const value  = parseFloat(parseFloat(heightElement.value).toFixed(2));
            const height = $clamp(value + event.movementX, 1, Number.MAX_VALUE);
            heightElement.value = `${height}`;

            transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.h);
            transformSetting.h = height;
        }

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};