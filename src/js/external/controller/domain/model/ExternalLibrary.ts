import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import type { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";
import { ExternalBitmap } from "@/external/core/domain/model/ExternalBitmap";

/**
 * @description ライブラリの外部APIクラス
 *              External API classes for the library
 *
 * @class
 */
export class ExternalLibrary
{
    private readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace)
    {
        this._$workSpace = work_space;
    }

    /**
     * @description 指定typeのアイテムを新規で作成して、指定のパスにライブラリに登録
     *              パスが存在しない場合は、自動的にフォルダが作成されます
     *              Create a new item of the specified type and register it in the library in the specified path
     *              If the path does not exist, the folder will be created automatically
     *
     * @param  {string} type
     * @param  {string} name
     * @param  {string} folder_path
     * @return {object}
     * @method
     * @public
     */
    addNewItem (
        type: InstanceTypeImpl,
        name: string,
        folder_path: string = ""
    ): ExternalInstanceImpl<any>
    {
        let folder;
        if (folder_path) {
            this.addNewFolder(folder_path);
        }

        let instance: ExternalInstanceImpl<any>;
        switch (type) {

            case "bitmap":
                instance = new ExternalBitmap(this._$workSpace);
                break;

        }

        // 名前をセット
        instance.name = name;

        return instance;
    }

    getItem (): ExternalInstanceImpl<any>
    {

    }

    /**
     * @description
     *
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    addNewFolder (path: string): void
    {
        const paths = path.split("/");

        let folderPaths = [];
        let folderId = 0;
        for (let idx = 0; idx < paths.length; ++idx) {

            const folderName = paths[idx];

            folderPaths.push(folderName);

            const item = this.getItem(folderPaths.join("/"));
            if (item) {
                folderId = item._$instance.id;
                continue;
            }

            const instance = workSpace.addLibrary({
                "id": this._$workSpace.nextLibraryId,
                "type": "",
                "name": folderName,
            });

            instance.folderId = folderId;
            folderId = instance.id;
        }
    }
}