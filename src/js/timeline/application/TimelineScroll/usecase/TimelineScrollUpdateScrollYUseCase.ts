import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description タイムラインのy座標を移動
 *              Move the y-coordinate of the timeline
 *
 * @param  {number} delta
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (delta: number): boolean =>
{
    if (!delta) {
        return false;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 0以下には移動しない
    if (!scene.scrollY && 0 > delta) {
        return false;
    }

    const beforeY = scene.scrollY;
    const afterY  = $clamp(beforeY + delta, 0, $getScrollLimitX());

    // 最大値より右側には移動しない
    if (beforeY === afterY) {
        return false;
    }

    scene.scrollY = afterY;

    // TODO

    return true;
};