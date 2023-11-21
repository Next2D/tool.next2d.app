import { execute as timelineHeaderBuildElementUseCase } from "./TimelineHeaderBuildElementUseCase";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // 移動していれば処理終了
    const workSpace = $getCurrentWorkSpace();
    if (workSpace.timelineAreaState.state === "move") {
        return ;
    }

    // 一つ前のタイマーを終了させる
    cancelAnimationFrame(timerId);

    timerId = requestAnimationFrame((): void =>
    {
        // タイムラインの表示幅を更新
        timelineHeaderUpdateClientWidthService();

        // 更新した表示幅でヘッダーを再描画
        timelineHeaderBuildElementUseCase();
    });
};