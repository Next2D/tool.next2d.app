import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description コントローラーエリアでマウスダウンした際の関数
 *              Function when mouse down in controller area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示にする
    $allHideMenu();
};