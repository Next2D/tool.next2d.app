import { $allHide } from "../../../menu/application/Menu";

/**
 * @description ツールエリアでマウスダウンした際の関数
 *              Function on mouse down in the tool area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 表示されてるメニューを全て非表示にする
    $allHide();
};