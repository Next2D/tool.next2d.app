import { $SCENE_LIST_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

/**
 * @description タイムラインの親のシーン名一覧のメニュークラス
 *              Screen area menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class SceneListMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCENE_LIST_MENU_NAME);
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        //
    }

    /**
     * @description メニュー位置を補正
     *              Correct menu position
     *
     * @return {HTMLElement}
     * @method
     * @public
     */
    move (element: HTMLElement): HTMLElement
    {
        element.style.left = `${this.offsetLeft}px`;
        element.style.top  = `${this.offsetTop}px`;
        return element;
    }
}