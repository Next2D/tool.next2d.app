import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";

/**
 * @description ConvertMovieClipModalのキャンセルボタンのPointerDownイベント
 *              PointerDown event for the cancel button of ConvertMovieClipModal
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を停止する
    event.stopPropagation();

    // モーダルを非表示にする
    convertMovieClipModalHideUseCase();
};