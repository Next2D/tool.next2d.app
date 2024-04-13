import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolEraseFramesUseCase } from "@/timeline/application/TimelineTool/application/EraseFrames/usecase/TimelineToolEraseFramesUseCase";

/**
 * @description タイムラインメニューのフレーム削除ボタンのマウスダウンイベント
 *              Mouse down event of the frame delete button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    $allHideMenu();

    // フレームを削除する
    timelineToolEraseFramesUseCase();
};