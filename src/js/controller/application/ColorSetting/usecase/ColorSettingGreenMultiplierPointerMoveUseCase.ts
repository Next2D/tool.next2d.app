import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getColorSettingState } from "../ColorSettingUtil";
import { execute as colorSettingGreenMultiplierUpdateElementUseCase } from "./ColorSettingGreenMultiplierUpdateElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 変形エリアの緑色マルチプライヤーの値操作のポインタームーブイベント
 *              Pointer move event for value operation of green multiplier of deformation area
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
        if ($getColorSettingState() === "up") {
            return ;
        }

        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 変更後の値を設定
        const value = $clamp(parseFloat(element.value) + event.movementX, 0, 100);

        element.value = `${value}`;

        // カラー設定を更新
        const workSpace = $getCurrentWorkSpace();
        colorSettingGreenMultiplierUpdateElementUseCase(
            workSpace.scene,
            value
        );
    });
};