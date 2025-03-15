import { execute as libraryAreaInitializeRegisterEventUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaInitializeRegisterEventUseCase";

/**
 * @description ライブラリエリアの選択アイテム管理クラス
 *              Selected item management class for the library area
 *
 * @class
 * @public
 */
class LibraryArea
{
    /**
     * @description 選択中のインスタンスID一覧を返却
     *              Returns a list of instance IDs currently selected
     *
     * @return {array}
     * @readonly
     * @public
     */
    public readonly selectedIds: number[];

    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @default 1
     * @public
     */
    public scrollScale: number;

    /**
     * @description プレビュー表示中のライブラリIDを返却
     *              Returns the library ID in the preview display
     *
     * @member {number}
     * @default -1
     * @public
     */
    public selectedId: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.selectedId  = -1;
        this.selectedIds = [];
        this.scrollScale = 1;
    }

    /**
     * @description 選択中のインスタンスID一覧を初期化
     *              Initialize the list of selected instance IDs
     *
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this.selectedId = -1;
        this.selectedIds.length = 0;
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
        libraryAreaInitializeRegisterEventUseCase();
    }
}

export const libraryArea = new LibraryArea();