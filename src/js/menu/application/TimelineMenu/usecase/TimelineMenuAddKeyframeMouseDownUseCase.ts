import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolAddKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddKeyFrame/usecase/TimelineToolAddKeyFrameUseCase";

/**
 * @description タイムラインメニューのキーフレーム追加ボタンのマウスダウンイベント
 *              Mouse down event of the keyframe add button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
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

    // キーフレームを追加する
    await timelineToolAddKeyFrameUseCase();
};