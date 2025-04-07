import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineMenuMoveFirstFrameService } from "../service/TimelineMenuMoveFirstFrameService";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインの1フレームへ移動ボタンのマウスダウンイベント
 *              Mouse down event of the move to 1 frame button in the timeline
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

    // 選択中のレイヤーの1フレームへ移動する
    await timelineMenuMoveFirstFrameService();
};