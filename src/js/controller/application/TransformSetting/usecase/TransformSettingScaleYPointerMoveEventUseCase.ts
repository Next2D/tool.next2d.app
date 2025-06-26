import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { $TRANSFORM_OBJECT_SCALE_X_ID } from "@/config/TransformSettingConfig";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 変形エリアのyスケールの値操作の処理関数
 *              Processing function for y-scale value manipulation of deformation area
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
        let scaleY = $clamp(value + event.movementX, -Number.MAX_VALUE, Number.MAX_VALUE);
        if (!scaleY) {
            scaleY = 0.01;
        }
        element.value = `${scaleY}`;

        // 変形に合わせて表示を更新
        const scale = scaleY / 100 / transformSetting.scaleY;
        transformSettingUpdateScaleYToElementValuesUseCase(scale);

        if (transformSetting.scaleLocked) {
            const scaleXElement = document
                .getElementById($TRANSFORM_OBJECT_SCALE_X_ID) as HTMLInputElement;
            if (!scaleXElement) {
                return ;
            }

            const value = parseFloat(parseFloat(scaleXElement.value).toFixed(2));
            let scaleX = $clamp(value * scale, -Number.MAX_VALUE, Number.MAX_VALUE);
            if (!scaleX) {
                scaleX = 0.01;
            }
            scaleXElement.value = `${scaleX}`;

            transformSettingUpdateScaleXToElementValuesUseCase(scale);
        }

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};