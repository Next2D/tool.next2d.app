import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 変形エリアのxスケールの値操作の処理関数
 *              Processing function for x-scale value manipulation of deformation area
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

    requestAnimationFrame(async (): Promise<void> =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const value = Math.round(parseFloat(element.value) * 100) / 100;
        let scaleX = $clamp(
            value + event.movementX,
            Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
        );
        if (!scaleX) {
            scaleX = 0.01;
        }

        // 変形に合わせて表示を更新
        const scale = scaleX / 100 / transformSetting.scaleX;
        await transformSettingUpdateScaleXToElementValuesUseCase(scale);

        if (transformSetting.scaleLocked) {
            await transformSettingUpdateScaleYToElementValuesUseCase(scale);
        }

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};