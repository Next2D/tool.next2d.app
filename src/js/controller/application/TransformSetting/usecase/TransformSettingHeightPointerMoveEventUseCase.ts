import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateHeightToElementValuesUseCase } from "./TransformSettingUpdateHeightToElementValuesUseCase";
import { execute as transformSettingUpdateWidthToElementValuesUseCase } from "./TransformSettingUpdateWidthToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";
import { $getTransformSettingState } from "../TransformSettingUtil";

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

    requestAnimationFrame(async (): Promise<void> =>
    {
        if ($getTransformSettingState() === "up") {
            return ;
        }

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

        // 変形に合わせて表示を更新
        const scale = height / transformSetting.h;
        await transformSettingUpdateHeightToElementValuesUseCase(scale);

        if (transformSetting.sizeLocked) {
            await transformSettingUpdateWidthToElementValuesUseCase(scale);
        }

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};