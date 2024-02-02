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
    constructor (work_space: WorkSpace)
    {
        super(work_space);

        // Bitmapクラスを生成
        this._$instance = new Bitmap({
            "id": this._$workSpace.nextLibraryId,
            "type": "bitmap"
        });
    }
}