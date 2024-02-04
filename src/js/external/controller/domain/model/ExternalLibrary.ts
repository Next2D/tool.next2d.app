import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import type { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";
import { ExternalBitmap } from "@/external/core/domain/model/ExternalBitmap";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { execute as libraryAreaAddNewFolderHistoryUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUseCase";

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
    ): ExternalInstanceImpl<any> {

        // TODO
        let folder: any;
        if (folder_path) {
            this.addNewFolder(folder_path);
            folder = this.getItem(folder_path);
            console.log(folder);
        }

        let instance: ExternalInstanceImpl<any>;
        switch (type) {

            case "bitmap":
                instance = new ExternalBitmap(this._$workSpace, name);
                break;

        }

        return instance;
    }

    importFile (file: File, path: string = ""): Promise<void>
    {
        return new Promise((resolve): void =>
        {
            console.log(file, path);
            resolve();
        });
    }

    getItem (path: string): ExternalInstanceImpl<any>
    {
        console.log(path);
    }

    /**
     * @description
     *
     * @param  {string} path
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    addNewFolder (path: string, receiver: boolean = false): void
    {
        const paths = path.split("/");

        const folderPaths: string[] = [];
        let folderId = 0;
        for (let idx = 0; idx < paths.length; ++idx) {

            const folderName = paths[idx];

            folderPaths.push(folderName);

            const instance = this.getItem(folderPaths.join("/"));

            // フォルダがあればスキップ
            if (instance && instance.type === "folder") {
                folderId = instance.id;
                continue;
            }

            // 新規フォルダを作成
            const externalFolder = new ExternalFolder(this._$workSpace, folderName);

            // 親階層のIDをセット
            externalFolder.folderId = folderId;

            // 作業履歴に残す
            // fixed logic
            libraryAreaAddNewFolderHistoryUseCase(
                this._$workSpace,
                this._$workSpace.scene,
                externalFolder.id,
                folderName,
                folderId,
                receiver
            );

            // 次は自分が親になるので、IDを書き換え
            // fixed logic
            folderId = externalFolder.id;
        }
    }
}