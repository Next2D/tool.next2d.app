import { execute as timelineToolEraseFramesUseCase } from "./TimelineToolEraseFramesUseCase";

/**
 * @description フレーム削除ボタンのイベント処理関数
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

    // フレーム削除のユースケースを実行
    timelineToolEraseFramesUseCase();
};