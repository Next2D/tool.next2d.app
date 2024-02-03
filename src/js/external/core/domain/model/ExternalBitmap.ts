import { Bitmap } from "@/core/domain/model/Bitmap";
import { ExternalItem } from "./ExternalItem";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

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
            "id": this._$workSpace.nextLibraryId,
            "type": "bitmap",
            "name": name,
            "symbol": symbol
        });

        // 内部情報を追加
        work_space
            .libraries
            .set(this._$instance.id, this._$instance);
    }
}