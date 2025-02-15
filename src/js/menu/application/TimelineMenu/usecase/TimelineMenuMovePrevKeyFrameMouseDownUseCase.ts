import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineMenuMovePrevKeyFrameService } from "../service/TimelineMenuMovePrevKeyFrameService";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインの前のキーフレームへの移動ボタンのマウスダウンイベント
 *              Mouse down event of the move to the previous key frame button in the timeline
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

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 選択中のレイヤーの最終フレームへ移動する
    await timelineMenuMovePrevKeyFrameService();
};