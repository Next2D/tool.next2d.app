import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { FolderTypeImpl } from "@/interface/FolderTypeImpl";
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
     * @param {string} name
     * @param {string} [mode = "close"]
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        name: string,
        mode: FolderTypeImpl = "close"
    ) {

        super(work_space);

        // フォルダクラスを生成
        this._$instance = new Folder({
            "id": this._$workSpace.nextLibraryId,
            "type": "folder",
            "name": name,
            "mode": mode
        });

        // 内部情報を追加
        work_space
            .libraries
            .set(this._$instance.id, this._$instance);
    }
}