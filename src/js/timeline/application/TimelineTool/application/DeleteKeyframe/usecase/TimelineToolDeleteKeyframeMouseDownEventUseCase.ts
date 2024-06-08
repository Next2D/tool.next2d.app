import { execute as timelineToolDeleteKeyframeUseCase } from "./TimelineToolDeleteKeyframeUseCase";

/**
 * @description キーフレーム削除ボタンのイベント処理関数
 *              Event processing function for keyframe deletion button
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

    // キーフレーム削除のユースケースを実行
    timelineToolDeleteKeyframeUseCase();
};