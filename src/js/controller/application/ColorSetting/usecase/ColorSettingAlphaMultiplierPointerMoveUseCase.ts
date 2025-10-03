import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { $getColorSettingState } from "../ColorSettingUtil";
import { execute as colorSettingAlphaMultiplierUpdateElementUseCase } from "./ColorSettingAlphaMultiplierUpdateElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 変形エリアのアルファマルチプライヤーの値操作のポインタームーブイベント
 *              Pointer move event for value operation of alpha multiplier of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
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
        colorSetting.value = colorSetting.beforeValue - value;

        // カラー設定を更新
        colorSettingAlphaMultiplierUpdateElementUseCase(value);
    });
};