import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { FolderTypeImpl } from "@/interface/FolderTypeImpl";
import { ExternalItem } from "./ExternalItem";
import { Folder } from "@/core/domain/model/Folder";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";

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
            "id": work_space.nextLibraryId,
            "type": "folder",
            "name": name,
            "mode": mode
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