import { $allHideMenu } from "../../../../menu/application/MenuUtil";

/**
 * @description Viewコンテナでマウスダウンした際の関数
 *              Function on mouse down in View container
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 全てのメニューを非表示にする
    $allHideMenu();
};