import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolDeleteKeyframeUseCase } from "@/timeline/application/TimelineTool/application/DeleteKeyframe/usecase/TimelineToolDeleteKeyframeUseCase";

/**
 * @description タイムラインメニューのキーフレーム削除ボタンのマウスダウンイベント
 *              Mouse down event of the keyframe delete button in the timeline menu
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

    // キーフレームを削除する
    timelineToolDeleteKeyframeUseCase();
};