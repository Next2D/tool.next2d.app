import { execute as timelineHeaderBuildElementUseCase } from "./TimelineHeaderBuildElementUseCase";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";
import { $getTimelineAreaState } from "../../TimelineArea/TimelineAreaUtil";

/**
 * @type {number}
 * @private
 */
let timerId: number = 0;

/**
 * @description タイムラインのヘッダーフレームにイベント登録を行う
 *              Register events in the header frame of the timeline
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 移動していれば処理終了
    if ($getTimelineAreaState() === "move") {
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