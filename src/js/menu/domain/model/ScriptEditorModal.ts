import { $SCRIPT_EDITOR_MODAL_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as scriptEditorModalInitializeRegisterEventUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalInitializeRegisterEventUseCase";
import { execute as scriptEditorModalInitializeUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalInitializeUseCase";
import { execute as scriptEditorModalSaveUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalSaveUseCase";
import { execute as scriptEditorModalBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalBootUseCase";

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
        super($SCRIPT_EDITOR_MODAL_NAME);
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
        // エディタのイベント登録
        scriptEditorModalInitializeRegisterEventUseCase();

        // エディタの初期起動処理
        scriptEditorModalInitializeUseCase();
    }

    /**
     * @description 表示処理関数
     *              display processing function
     *
     * @return {void}
     * @method
     * @public
     */
    show (): void
    {
        if (this.state === "show") {
            return ;
        }

        // fixed logic
        super.show();

        // スクリプトエディタを起動
        scriptEditorModalBootUseCase();
    }

    /**
     * @description 非表示処理関数
     *              hide operation function
     *
     * @returns {void}
     * @method
     * @public
     */
    hide (): void
    {
        if (this._$state === "hide") {
            return ;
        }

        // fixed logic
        super.hide();

        // 保存処理
        scriptEditorModalSaveUseCase();
    }
}