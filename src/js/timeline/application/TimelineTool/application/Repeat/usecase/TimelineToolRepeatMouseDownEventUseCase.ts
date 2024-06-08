import { execute as timelineToolRepeatUseCase } from "./TimelineToolRepeatUseCase";

/**
 * @description ループ設定のマウスダウンのイベント処理関数
 *              Mouse down event processing function for loop settings
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();

    // ループフラグを反転させる
    timelineToolRepeatUseCase();
};