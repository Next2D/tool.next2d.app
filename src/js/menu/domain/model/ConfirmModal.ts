import { BaseMenu } from "./BaseMenu";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import type { ConfirmModalFileObjectImpl } from "@/interface/ConfirmModalFileObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as confirmModalInitializeRegisterEventUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalInitializeRegisterEventUseCase";
import { execute as confirmModalUpdateDisplayUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalUpdateDisplayUseCase";
import { execute as confirmModalFileResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileResetService";

/**
 * @description ライブラリ読み込み時の重複チェックモーダル管理クラス
 *              Duplicate check modal management class for library loading
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ConfirmModal extends BaseMenu
{
    private readonly _$fileObjects: ConfirmModalFileObjectImpl[];
    private _$fileObject: ConfirmModalFileObjectImpl | null;
    private readonly _$instanceObjects: InstanceImpl<any>[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($CONFIRM_MODAL_NAME);

        /**
         * @type {array}
         * @private
         */
        this._$fileObjects = [];

        /**
         * @type {object}
         * @private
         */
        this._$fileObject = null;

        /**
         * @type {array}
         * @private
         */
        this._$instanceObjects = [];
    }

    /**
     * @description Fileの読み込み時の重複配列
     *              Duplicate array when reading File
     *
     * @readonly
     * @public
     */
    get fileObjects (): ConfirmModalFileObjectImpl[]
    {
        return this._$fileObjects;
    }

    /**
     * @description 現在利用中のFileオブジェクト
     *              File object currently in use
     *
     * @member {object | null}
     * @public
     */
    get fileObject (): ConfirmModalFileObjectImpl | null
    {
        return this._$fileObject;
    }
    set fileObject (file_object: ConfirmModalFileObjectImpl | null)
    {
        this._$fileObject = file_object;
    }

    /**
     * @description Fileの配列から作業変数にセット
     *              Set to a working variable from an array of File
     *
     * @return {void}
     * @method
     * @public
     */
    setupFileObject (): void
    {
        // 配列が空なら終了
        if (!this._$fileObjects.length) {
            // 初期化して終了
            confirmModalFileResetService();
            return this.hide();
        }

        this._$fileObject = this._$fileObjects.pop() as NonNullable<ConfirmModalFileObjectImpl>;

        // 表示を更新
        confirmModalUpdateDisplayUseCase(
            this._$fileObject.file,
            this._$fileObject.instance
        );

        this.show();
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
        confirmModalInitializeRegisterEventUseCase();
    }
}