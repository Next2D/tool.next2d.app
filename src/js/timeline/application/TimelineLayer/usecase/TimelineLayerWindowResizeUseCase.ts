import { execute as timelineLayerBuildElementUseCase } from "./TimelineLayerBuildElementUseCase";
/**
 * @type {number}
 * @private
 */
let timerId: number = 0;

/**
 * @description タイムラインのリサイズ時の実行関数
 *              Execution function when resizing the timeline
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 一つ前のタイマーを終了させる
    cancelAnimationFrame(timerId);

    timerId = requestAnimationFrame((): void =>
    {
        // タイムラインの幅を再描画
        timelineLayerBuildElementUseCase();
    });
};