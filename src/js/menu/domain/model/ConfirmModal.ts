import { BaseMenu } from "./BaseMenu";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import type { ConfirmModalFileObjectImpl } from "@/interface/ConfirmModalFileObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as confirmModalInitializeRegisterEventUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalInitializeRegisterEventUseCase";

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
    private readonly _$instances: InstanceImpl<any>[];

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
         * @type {array}
         * @private
         */
        this._$instances = [];
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