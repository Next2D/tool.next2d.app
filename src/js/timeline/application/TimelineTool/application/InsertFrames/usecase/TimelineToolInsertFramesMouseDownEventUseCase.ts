import { execute as timelineToolInsertFramesUseCase } from "./TimelineToolInsertFramesUseCase";

/**
 * @description キーフレーム追加ボタンのイベント処理関数
 *              Event processing function for add keyframe button
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
    event.preventDefault();

    // キーフレーム追加のユースケースを実行
    timelineToolInsertFramesUseCase();
};