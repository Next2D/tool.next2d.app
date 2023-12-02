import { execute as timelineHeaderWindowResizeUseCase } from "./TimelineLayerWindowResizeUseCase";

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
    // ブラウザの表示サイズに変更イベント処理
    window.addEventListener("resize", timelineHeaderWindowResizeUseCase);
};