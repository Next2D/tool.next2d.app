import { $SCRIPT_EDITOR_MODAL_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as scriptEditorModalInitializeRegisterEventUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalInitializeRegisterEventUseCase";
import { execute as scriptEditorModalInitializeUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalInitializeUseCase";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

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
    private readonly _$editor: AceAjax.Editor;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCRIPT_EDITOR_MODAL_NAME);

        /**
         * @type {AceAjax.Editor}
         * @private
         */
        this._$editor = ace.edit("editor");
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
        scriptEditorModalInitializeRegisterEventUseCase(this._$editor);

        // エディタの初期起動処理
        scriptEditorModalInitializeUseCase(this._$editor);
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

        // 入力モードをonにする
        $updateKeyLock(true);

        // フォーカスをセット
        this._$editor.focus();
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

        // 入力モードをoffにする
        $updateKeyLock(false);

        // TODO 保存処理
    }

    /**
     * @description AceEditorオブジェクトを返却
     *              Return AceEditor object
     *
     * @member {AceAjax.Editor}
     * @readonly
     * @public
     */
    get editor (): AceAjax.Editor
    {
        return this._$editor;
    }
}