import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineMenuMoveLastFrameService } from "../service/TimelineMenuMoveLastFrameService";

/**
 * @description タイムラインメニューの最終フレームへ移動ボタンのマウスダウンイベント
 *              Mouse down event of the move to last frame button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {void}
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

    // 選択中のレイヤーの最終フレームへ移動する
    await timelineMenuMoveLastFrameService();
};