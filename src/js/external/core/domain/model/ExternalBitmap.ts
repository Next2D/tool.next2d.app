import { Bitmap } from "@/core/domain/model/Bitmap";
import { ExternalItem } from "./ExternalItem";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";

/**
 * @description 画像アイテムのクラス
 *              Image Item Class
 *
 * @class
 * @public
 */
export class ExternalBitmap extends ExternalItem
{
    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        name: string,
        symbol: string = ""
    ) {
        super(work_space);

        // Bitmapクラスを生成
        this._$instance = new Bitmap({
            "id": work_space.nextLibraryId,
            "type": "bitmap",
            "name": name,
            "symbol": symbol
        });

        // 内部情報を追加
        externalLibraryAddInstanceUseCase(work_space, this._$instance);
    }

    /**
     * @description ライブラリからの削除処理
     *              Deletion process from the library
     *
     * @return {void}
     * @method
     * @public
     */
    remove (): void
    {
        // TODO
    }
}