import { $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description カラーパレットのポインターダウンイベント
 *              Color palette pointer down event
 *
 * @param event {PointerEvent}
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // イベントの伝達を止める
    event.stopPropagation();
};