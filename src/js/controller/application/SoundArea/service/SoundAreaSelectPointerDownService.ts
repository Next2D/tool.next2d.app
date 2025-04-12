import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description サウンドエリアのセレクトボックスのポインターダウンイベント
 *              Sound area select box pointer down event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // メニューを全て隠す
    $allHideMenu();

    // 編集中の要素をnullにする
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
};