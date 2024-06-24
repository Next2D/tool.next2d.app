import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineMenuMoveFirstFrameService } from "../service/TimelineMenuMoveFirstFrameService";

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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    $allHideMenu();

    // 選択中のレイヤーの1フレームへ移動する
    await timelineMenuMoveFirstFrameService();
};