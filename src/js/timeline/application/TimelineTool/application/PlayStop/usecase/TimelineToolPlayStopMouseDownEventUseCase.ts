import { execute as timelineToolPlayStopUseCase } from "./TimelineToolPlayStopUseCase";

/**
 * @description 再生・停止ボタンのマウスダウンのイベント処理関数
 *              Event processing function for mouse down of play/stop button
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // ループフラグを反転させる
    await timelineToolPlayStopUseCase();
};