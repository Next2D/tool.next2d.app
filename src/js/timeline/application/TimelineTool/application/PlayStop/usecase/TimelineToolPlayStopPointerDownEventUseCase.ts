import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineToolPlayStopUseCase } from "./TimelineToolPlayStopUseCase";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 再生・停止ボタンのマウスダウンのイベント処理関数
 *              Event processing function for mouse down of play/stop button
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素をnullにする
    $setEditingElement(null);

    // ループフラグを反転させる
    await timelineToolPlayStopUseCase();
};