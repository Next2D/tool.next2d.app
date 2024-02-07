import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import type { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as externalLibraryAddNewFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewFolderUseCase";
import { execute as libraryAreaAllClearElementService } from "@/controller/application/LibraryArea/service/LibraryAreaAllClearElementService";
import { execute as libraryAreaActiveElementService } from "@/controller/application/LibraryArea/service/LibraryAreaActiveElementService";
import { execute as externalLibrarySelectedOneService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibrarySelectedOneService";
import { execute as externalLibraryImportBitmapFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportBitmapFileUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as externalLibraryCreateInstanceService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibraryCreateInstanceService";

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
     * @param  {string} path
     * @param  {boolean} [reload = false]
     * @return {Promise}
     * @method
     * @public
     */
    async importFile (
        file: File,
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
                await externalLibraryImportBitmapFileUseCase(this._$workSpace, file, path);
                break;

            // ビデオ
            case "video/mp4":
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
     * @return {void}
     * @method
     * @public
     */
    addNewFolder (path: string): void
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
                folderName, folderId
            );

            // 次は自分が親になるので、IDを書き換え
            // fixed logic
            folderId = folder.id;
        }
    }
}