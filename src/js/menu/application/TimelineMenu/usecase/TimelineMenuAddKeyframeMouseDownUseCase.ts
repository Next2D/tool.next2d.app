import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolAddKeyFrameUseCase } from "@/timeline/application/TimelineTool/application/AddKeyFrame/usecase/TimelineToolAddKeyFrameUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // キーフレームを追加する
    await timelineToolAddKeyFrameUseCase();
};