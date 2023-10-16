import { execute as menuAllHideService } from "../../../menu/application/service/MenuAllHideService";

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
    menuAllHideService();
};