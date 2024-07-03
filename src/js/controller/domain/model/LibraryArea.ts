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
    private readonly _$selectedIds: number[];
    private _$scrollScale: number;
    private _$selectedId: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._$selectedId = -1;

        /**
         * @type {array}
         * @private
         */
        this._$selectedIds = [];

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scrollScale = 1;
    }

    /**
     * @description プレビュー表示中のライブラリIDを返却
     *              
     *
     * @member {number}
     * @public
     */
    get selectedId (): number
    {
        return this._$selectedId;
    }
    set selectedId (selected_id: number)
    {
        this._$selectedId = selected_id;
    }

    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @public
     */
    get scrollScale (): number
    {
        return this._$scrollScale;
    }
    set scrollScale (scroll_scale: number)
    {
        this._$scrollScale = scroll_scale;
    }

    /**
     * @description 選択中のインスタンスID一覧を返却
     *              Returns a list of instance IDs currently selected
     *
     * @return {array}
     * @readonly
     * @public
     */
    get selectedIds (): number[]
    {
        return this._$selectedIds;
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
        this._$selectedId = -1;
        this._$selectedIds.length = 0;
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