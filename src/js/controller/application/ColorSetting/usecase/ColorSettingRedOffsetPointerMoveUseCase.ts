import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getColorSettingState } from "../ColorSettingUtil";
import { execute as colorSettingRedOffsetUpdateElementUseCase } from "./ColorSettingRedOffsetUpdateElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description カラー設定エリアの赤色オフセットの値操作のポインタームーブイベント
 *              Pointer move event for value operation of red offset of color setting area
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
        const value = $clamp(parseFloat(element.value) + event.movementX, -255, 255);

        element.value = `${value}`;

        // カラー設定を更新
        const workSpace = $getCurrentWorkSpace();
        colorSettingRedOffsetUpdateElementUseCase(
            workSpace.scene,
            value
        );
    });
};