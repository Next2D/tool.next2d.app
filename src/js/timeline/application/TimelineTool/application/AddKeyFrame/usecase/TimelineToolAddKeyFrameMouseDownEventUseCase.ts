import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineToolAddKeyFrameUseCase } from "./TimelineToolAddKeyFrameUseCase";

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

    const workSpace = $getCurrentWorkSpace();

    // キーフレーム追加のユースケースを実行
    timelineToolAddKeyFrameUseCase(workSpace, workSpace.scene);
};