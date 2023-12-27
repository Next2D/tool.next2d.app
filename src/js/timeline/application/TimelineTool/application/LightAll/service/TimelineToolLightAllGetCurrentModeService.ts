import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getAllLightMode } from "@/timeline/application/TimelineUtil";

/**
 * @description 現在のレイヤーのハイライト状態をチェックして、モードを返却する
 *              Check the highlight state of the current layer and return the mode
 *
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (): boolean =>
{
    const layers = $getCurrentWorkSpace().scene.layers;
    switch (true) {

        // 全てOnならOffにする設定にする
        case layers.every((layer): boolean => { return layer.light === true }):
            return false;

        // 全てOffならOnにする設定にする
        case layers.every((layer): boolean => { return layer.light === false }):
            return true;

        // 現在の値を反転して変数にセット
        default:
            return !$getAllLightMode();
    }
};