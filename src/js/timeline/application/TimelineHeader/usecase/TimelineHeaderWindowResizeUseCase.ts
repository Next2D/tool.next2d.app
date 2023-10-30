import { execute as timelineHeaderBuildElementUseCase } from "./TimelineHeaderBuildElementUseCase";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";

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
    // タイムラインの表示幅を更新
    timelineHeaderUpdateClientWidthService();

    // 更新した表示幅でヘッダーを再描画
    timelineHeaderBuildElementUseCase();
};