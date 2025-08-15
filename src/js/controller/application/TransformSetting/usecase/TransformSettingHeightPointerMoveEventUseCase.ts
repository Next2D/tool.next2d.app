import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateHeightToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateHeightToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";
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

        if (!transformSetting.h) {
            return ;
        }

        if (transformSetting.sizeLocked && !transformSetting.w) {
            return ;
        }

        // 表示を更新
        const height = $clamp(
            Math.round((parseFloat(element.value) + event.movementX) * 100) / 100,
            1, Number.MAX_VALUE
        );
        element.value = `${height}`;

        // 変形に合わせて表示を更新
        const scale = height / transformSetting.h;
        transformSettingUpdateHeightToElementValuesUseCase(scale);
        transformSetting.h = height;

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

            transformSettingUpdateScaleXToElementValuesUseCase(scale);
            transformSetting.w = width;
        }

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};