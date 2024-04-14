import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolAddEmptyKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddEmptyKeyFrame/usecase/TimelineToolAddEmptyKeyFrameUseCase";

/**
 * @description タイムラインメニューの空のキーフレーム追加ボタンのマウスダウンイベント
 *              Mouse down event of the empty keyframe add button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    $allHideMenu();

    // 空のキーフレームを追加する
    await timelineToolAddEmptyKeyFrameUseCase();
};