import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import {
    $getMoveOffsetX,
    $getMoveOffsetY,
    $getMoveState,
    $setMoveState
} from "../LibraryAreaUtil";

/**
 * @description スクリーンへの移動イベント関数
 *              Move event function to screen
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    if (!event.clientX && !event.clientY) {
        return ;
    }

    if (!$getMoveState()) {
        $setMoveState(true);
        element.style.pointerEvents = "none";
        element.style.position = "fixed";
    }

    // メニューを全て非表示に更新
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(() =>
    {
        if (!$getMoveState()) {
            return ;
        }

        // 移動処理
        element.style.left = `${event.clientX - $getMoveOffsetX()}px`;
        element.style.top  = `${event.clientY - $getMoveOffsetY()}px`;
    });
};