import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineMenuMoveNextKeyFrameService } from "../service/TimelineMenuMoveNextKeyFrameService";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインの次のキーフレームへの移動ボタンのマウスダウンイベント
 *              Mouse down event of the move to the next key frame button in the timeline
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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 選択中のレイヤーの最終フレームへ移動する
    await timelineMenuMoveNextKeyFrameService();
};