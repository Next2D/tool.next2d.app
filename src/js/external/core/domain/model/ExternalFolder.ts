import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalItem } from "./ExternalItem";
import { Folder } from "@/core/domain/model/Folder";

/**
 * @extends {ExternalItem}
 * @class
 * @public
 */
export class ExternalFolder extends ExternalItem
{
    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace)
    {
        super(work_space);

        // フォルダクラスを生成
        this._$instance = new Folder({
            "id": this._$workSpace.nextLibraryId,
            "type": "folder",
            "mode": "close"
        });
    }
}