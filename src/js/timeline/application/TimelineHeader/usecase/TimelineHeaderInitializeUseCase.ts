import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";
import { execute as timelineHeaderWindowResizeUseCase } from "./TimelineHeaderWindowResizeUseCase";

/**
 * @description タイムラインのヘッダー初期起動ユースケース
 *              Timeline Header Initial Launch Use Case
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 表示幅を更新
    timelineHeaderUpdateClientWidthService();

    // ブラウザの表示サイズに変更イベント処理
    window.addEventListener("resize", timelineHeaderWindowResizeUseCase);
};