import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description 親Elementのマウスダウン処理関数、Elementを選択状態に更新
 *              Mouse down processing function of parent Element, update Element to selected state
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

    // 親のイベントを中止
    event.stopPropagation();

    // メニューを全て非表示に更新
    $allHideMenu();

    console.log([element]);
};