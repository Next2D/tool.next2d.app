import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalItem } from "./ExternalItem";
import { Folder } from "@/core/domain/model/Folder";
import { execute as libraryAreaUpdateFolderStateService } from "@/controller/application/LibraryArea/service/LibraryAreaUpdateFolderStateService";

/**
 * @extends {ExternalItem}
 * @class
 * @public
 */
export class ExternalFolder extends ExternalItem
{
    /**
     * @param {WorkSpace} work_space
     * @param {Folder} folder
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        folder: Folder
    ) {

        super(work_space);

        // フォルダクラスを生成
        this._$instance = folder;
    }

    /**
     * @description フォルダを開けて、一覧を表示
     *              Open a folder and view the list
     *
     * @return {void}
     * @method
     * @public
     */
    open (): void
    {
        this._$instance.mode = "open";

        // 起動中のプロジェクトなら表示を更新
        if (this._$workSpace.active) {
            // フォルダの表示を更新
            libraryAreaUpdateFolderStateService(this._$instance);
        }
    }

    /**
     * @description フォルダを閉じて、一覧を非表示に
     *              Close the folder and hide the list
     *
     * @return {void}
     * @method
     * @public
     */
    close (): void
    {
        this._$instance.mode = "close";

        // 起動中のプロジェクトなら表示を更新
        if (this._$workSpace.active) {
            // フォルダの表示を更新
            libraryAreaUpdateFolderStateService(this._$instance);
        }
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