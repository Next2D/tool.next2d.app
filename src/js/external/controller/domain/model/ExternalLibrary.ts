import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { execute as externalLibraryAddNewFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewFolderUseCase";
import { execute as libraryAreaAllClearElementService } from "@/controller/application/LibraryArea/service/LibraryAreaAllClearElementService";
import { execute as libraryAreaActiveElementService } from "@/controller/application/LibraryArea/service/LibraryAreaActiveElementService";
import { execute as externalLibrarySelectedOneService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibrarySelectedOneService";
import { execute as externalLibraryImportBitmapFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportBitmapFileUseCase";
import { execute as externalLibraryImportVideoFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportVideoFileUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as externalLibraryCreateInstanceService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibraryCreateInstanceService";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as libraryAreaMoveFolderHistoryUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUseCase";

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
     * @description 外部ファイルの読み込み
     *              Loading external files
     *
     * @param  {File} file
     * @param  {string} name
     * @param  {string} path
     * @param  {boolean} [reload = false]
     * @return {Promise}
     * @method
     * @public
     */
    async importFile (
        file: File,
        name: string,
        path: string = "",
        reload: boolean = true
    ): Promise<void> {

        switch (file.type) {

            // SVG
            case "image/svg+xml":
                break;

            // 画像
            case "image/png":
            case "image/jpeg":
            case "image/gif":
                await externalLibraryImportBitmapFileUseCase(this._$workSpace, file, name, path);
                break;

            // ビデオ
            case "video/mp4":
                await externalLibraryImportVideoFileUseCase(this._$workSpace, file, name, path);
                break;

            // 音声
            case "audio/mpeg":
                break;

            // SWF
            case "application/x-shockwave-flash":
                break;

            default:
                return ;

        }

        if (reload) {
            // 読み込んだファイルを昇順に並び替え
            libraryAreaReOrderingService(this._$workSpace);

            // 起動中のプロジェクトならライブラリエリアをさ描画
            if (this._$workSpace.active) {
                libraryAreaReloadUseCase();
            }
        }
    }

    /**
     * @description 指定のライブラリアイテムを返却
     *              Returns specified library items
     *
     * @return {object | null}
     * @method
     * @public
     */
    getItem (path: string): ExternalInstanceImpl<any> | null
    {
        if (!this._$workSpace.pathMap.has(path)) {
            return null;
        }

        const libraryId = this._$workSpace.pathMap.get(path) as NonNullable<number>;
        const instance: InstanceImpl<any> | null = this._$workSpace.getLibrary(libraryId);
        if (!instance) {
            return null;
        }

        // タイプ別のクラスを作成
        return externalLibraryCreateInstanceService(this._$workSpace, instance);
    }

    /**
     * @description 指定のアイテムをフォルダの外に移動、成功時はtrue、失敗時はfalseを返却
     *              Moves specified item out of folder, returns true on success, false on failure
     *
     * @param  {string}  item_path
     * @param  {boolean} [reload = true]
     * @return {boolean}
     * @method
     * @public
     */
    outOfFolder (
        item_path: string,
        reload: boolean = true
    ): boolean {

        const item = this.getItem(item_path);
        if (!item || item.folderId === 0) {
            return false;
        }

        // 履歴に残す
        // fixed logic
        libraryAreaMoveFolderHistoryUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            item,
            0
        );

        // フォルダの外(top)に移動
        item.folderId = 0;

        // 再読み込みがonなら再生成
        if (reload) {
            workSpaceCreatePathMapService(this._$workSpace);

            // ソートを実行
            libraryAreaReOrderingService(this._$workSpace);

            // アクティブなプロジェクトなら再描画
            if (this._$workSpace.active) {
                libraryAreaReloadUseCase();
            }
        }

        return true;
    }

    /**
     * @description 指定のフォルダに指定のアイテムを移動、成功時はtrue、失敗時はfalseを返却
     *              Move the specified item to the specified folder, returning true on success, false on failure
     *
     * @param  {string}  folder_path
     * @param  {string}  item_path
     * @param  {boolean} [reload = true]
     * @return {boolean}
     * @method
     * @public
     */
    moveToFolder (
        folder_path: string,
        item_path: string,
        reload: boolean = true
    ): boolean {

        const folder = this.getItem(folder_path);
        if (!folder) {
            return false;
        }

        const item = this.getItem(item_path);
        if (!item) {
            return false;
        }

        if (item.folderId === folder.id) {
            return false;
        }

        // 移動するアイテムがフォルダの場合は、親階層のフォルダと重複してないかチェックする
        if (item.type === "folder"
            && (folder as ExternalFolder).checkDuplicate(item.id)
        ) {
            return false;
        }

        // 履歴に残す
        // fixed logic
        libraryAreaMoveFolderHistoryUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            item,
            folder.id
        );

        // フォルダ内に格納
        item.folderId = folder.id;

        // 再読み込みがonなら再生成
        if (reload) {
            workSpaceCreatePathMapService(this._$workSpace);

            // ソートを実行
            libraryAreaReOrderingService(this._$workSpace);

            // アクティブなプロジェクトなら再描画
            if (this._$workSpace.active) {
                libraryAreaReloadUseCase();
            }
        }

        return true;
    }

    /**
     * @description 指定のライブラリアイテムを選択状態にする
     *              Make the specified library item selected
     *
     * @param  {string} path_name
     * @return {void}
     * @method
     * @public
     */
    selectedItem (path_name: string): void
    {
        const item = this.getItem(path_name);
        if (!item) {
            return ;
        }

        // 起動中のプロジェクトなら選択中のElementを初期化
        if (this._$workSpace.active) {
            libraryAreaAllClearElementService();
        }

        // 内部情報を更新
        externalLibrarySelectedOneService(item.id);

        // 起動中のプロジェクトなら指定のアイテムのElementをアクティブに更新
        if (this._$workSpace.active) {
            libraryAreaActiveElementService(item.id);
        }
    }

    /**
     * @description 指定の階層に新規フォルダーを追加、階層が存在しなければフォルダを生成
     *              Add a new folder to the specified hierarchy, or create a folder if the hierarchy does not exist
     *
     * @param  {string} path
     * @param  {boolean} [reload = true]
     * @return {void}
     * @method
     * @public
     */
    addNewFolder (path: string, reload: boolean = true): void
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
            const folder = externalLibraryAddNewFolderUseCase(
                this._$workSpace,
                this._$workSpace.scene,
                folderName, folderId, reload
            );

            // 次は自分が親になるので、IDを書き換え
            // fixed logic
            folderId = folder.id;
        }
    }
}