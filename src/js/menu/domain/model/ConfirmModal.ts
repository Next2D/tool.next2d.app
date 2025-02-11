import type { IConfirmModalFileObject } from "@/interface/IConfirmModalFileObject";
import type { IConfirmModalInstanceObject } from "@/interface/IConfirmModalInstanceObject";
import { BaseMenu } from "./BaseMenu";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { execute as confirmModalInitializeRegisterEventUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalInitializeRegisterEventUseCase";
import { execute as confirmModalUpdateDisplayByFileUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalUpdateDisplayByFileUseCase";
import { execute as confirmModalFileResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileResetService";
import { execute as confirmModalInstaceResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalInstaceResetService";

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
    private _$instanceObject: IConfirmModalInstanceObject | null;
    private _$fileObject: IConfirmModalFileObject | null;
    private readonly _$fileObjects: IConfirmModalFileObject[];
    private readonly _$instanceObjects: IConfirmModalInstanceObject[];

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

        /**
         * @type {object}
         * @private
         */
        this._$instanceObject = null;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        confirmModalInitializeRegisterEventUseCase();
    }

    /**
     * @description Fileの読み込み時の重複配列
     *              Duplicate array when reading File
     *
     * @readonly
     * @public
     */
    get fileObjects (): IConfirmModalFileObject[]
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
    get fileObject (): IConfirmModalFileObject | null
    {
        return this._$fileObject;
    }
    set fileObject (file_object: IConfirmModalFileObject | null)
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

            // モーダルを非表示に更新
            return this.hide();
        }

        this._$fileObject = this._$fileObjects.pop() as NonNullable<IConfirmModalFileObject>;

        // 表示を更新
        confirmModalUpdateDisplayByFileUseCase(
            this._$fileObject.file,
            this._$fileObject.instance
        );

        this.show();
    }

    /**
     * @description Instanceの読み込み時の重複配列
     *              Duplicate array when reading Instance
     *
     * @readonly
     * @public
     */
    get instanceObjects (): IConfirmModalInstanceObject[]
    {
        return this._$instanceObjects;
    }

    /**
     * @description 現在利用中のInstanceオブジェクト
     *              Instance object currently in use
     *
     * @member {object | null}
     * @public
     */
    get instanceObject (): IConfirmModalInstanceObject| null
    {
        return this._$instanceObject;
    }
    set instanceObject (instance_object: IConfirmModalInstanceObject | null)
    {
        this._$instanceObject = instance_object;
    }

    /**
     * @description Instanceの配列から作業変数にセット
     *              Set to a working variable from an array of Instance
     *
     * @return {void}
     * @method
     * @public
     */
    setupInstanceObject (): void
    {
        // 配列が空なら終了
        if (!this._$instanceObjects.length) {

            // 初期化して終了
            confirmModalInstaceResetService();

            // モーダルを非表示に更新
            return this.hide();
        }

        this._$instanceObject = this._$instanceObjects.pop() as NonNullable<IConfirmModalInstanceObject>;

        // // 表示を更新
        // confirmModalUpdateDisplayUseCase(
        //     this._$fileObject.file,
        //     this._$fileObject.instance
        // );

        this.show();
    }
}