import { execute as timelineHeaderBuildElementUseCase } from "./TimelineHeaderBuildElementUseCase";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";

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
    // タイムラインの表示幅を更新
    timelineHeaderUpdateClientWidthService();

    // 更新した表示幅でヘッダーを再描画
    timelineHeaderBuildElementUseCase();
};