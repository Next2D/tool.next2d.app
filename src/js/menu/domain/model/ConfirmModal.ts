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
    /**
     * @description 現在利用中のInstanceオブジェクト
     *              Instance object currently in use
     *
     * @member {object | null}
     * @public
     */
    public instanceObject: IConfirmModalInstanceObject | null;

    /**
     * @description 現在利用中のFileオブジェクト
     *              File object currently in use
     *
     * @member {object | null}
     * @public
     */
    public fileObject: IConfirmModalFileObject | null;

    /**
     * @description Fileの読み込み時の重複配列
     *              Duplicate array when reading File
     *
     * @readonly
     * @public
     */
    public readonly fileObjects: IConfirmModalFileObject[];

    /**
     * @description Instanceの読み込み時の重複配列
     *              Duplicate array when reading Instance
     *
     * @readonly
     * @public
     */
    public readonly instanceObjects: IConfirmModalInstanceObject[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($CONFIRM_MODAL_NAME);

        this.fileObject  = null;
        this.fileObjects = [];

        this.instanceObject  = null;
        this.instanceObjects = [];
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
        if (!this.fileObjects.length) {

            // 初期化して終了
            confirmModalFileResetService();

            // モーダルを非表示に更新
            return this.hide();
        }

        this.fileObject = this.fileObjects.pop() as NonNullable<IConfirmModalFileObject>;

        // 表示を更新
        confirmModalUpdateDisplayByFileUseCase(
            this.fileObject.file,
            this.fileObject.instance
        );

        this.show();
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
        if (!this.instanceObjects.length) {

            // 初期化して終了
            confirmModalInstaceResetService();

            // モーダルを非表示に更新
            return this.hide();
        }

        this.instanceObject = this.instanceObjects.pop() as NonNullable<IConfirmModalInstanceObject>;

        // // 表示を更新
        // confirmModalUpdateDisplayUseCase(
        //     this.fileObject.file,
        //     this.fileObject.instance
        // );

        this.show();
    }
}