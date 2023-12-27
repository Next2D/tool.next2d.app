import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getAllLockMode } from "@/timeline/application/TimelineUtil";

/**
 * @description 現在のレイヤーのロック状態をチェックして、モードを返却する
 *              Check the lock status of the current layer and return mode
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
        case layers.every((layer): boolean => { return layer.lock === true }):
            return false;

        // 全てOffならOnにする設定にする
        case layers.every((layer): boolean => { return layer.lock === false }):
            return true;

        // 現在の値を反転して変数にセット
        default:
            return !$getAllLockMode();
    }
};