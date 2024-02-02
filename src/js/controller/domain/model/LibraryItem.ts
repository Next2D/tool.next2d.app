import { execute as libraryAreaInitializeRegisterEventUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaInitializeRegisterEventUseCase";

/**
 * @description ライブラリの選択アイテム管理クラス
 *              Library Selected Item Management Class
 *
 * @class
 * @public
 */
export class LibraryItem
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        //
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

export const libraryItem = new LibraryItem();