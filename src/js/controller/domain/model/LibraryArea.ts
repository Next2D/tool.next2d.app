import { execute as libraryAreaInitializeRegisterEventUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaInitializeRegisterEventUseCase";

/**
 * @description ライブラリエリアの選択アイテム管理クラス
 *              Selected item management class for the library area
 *
 * @class
 * @public
 */
export class LibraryArea
{
    private readonly _$selectedIds: number[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$selectedIds = [];
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