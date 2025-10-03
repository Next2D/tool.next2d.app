import { execute as transformSettingUpdateRotateToElementValuesUseCase } from "./TransformSettingUpdateRotateToElementValuesUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { $setCursor } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getTransformSettingState } from "../TransformSettingUtil";

/**
 * @description 変形エリアの回転の値操作の処理関数
 *              Processing function for rotation value manipulation of deformation area
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

        // 表示を更新
        let rotation = (parseInt(element.value) + event.movementX) % 360;
        if (0 > rotation) {
            rotation &= 360;
        }

        element.value = `${rotation}`;

        const rotate = rotation - transformSetting.rotation;
        await transformSettingUpdateRotateToElementValuesUseCase(rotate);
        transformSetting.rotation = rotation;

        // 選択中の表示領域を更新
        targetRectUpdateElementUseCase();
    });
};