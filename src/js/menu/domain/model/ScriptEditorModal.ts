import { $EDITOR_MODAL_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

/**
 * @description スクリプトメニューの管理クラス
 *              Script menu management class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ScriptEditorModal extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($EDITOR_MODAL_NAME);
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
        // TODO
    }
}