import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getMoveOffsetX, $getMoveOffsetY, $getMoveState, $setMoveState } from "../LibraryAreaUtil";

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

    if (!$getMoveState()) {
        $setMoveState(true);
        element.style.position = "fixed";
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示に更新
    $allHideMenu();

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