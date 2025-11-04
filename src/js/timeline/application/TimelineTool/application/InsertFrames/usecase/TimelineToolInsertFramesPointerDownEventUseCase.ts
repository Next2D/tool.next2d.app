import { execute as timelineToolInsertFramesUseCase } from "./TimelineToolInsertFramesUseCase";

/**
 * @description フレーム追加ボタンのイベント処理関数
 *              Event processing function for add keyframe button
 *
 * @param  {PointerEvent} event
 * @return {Promise}
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

    // キーフレーム追加のユースケースを実行
    await timelineToolInsertFramesUseCase();
};