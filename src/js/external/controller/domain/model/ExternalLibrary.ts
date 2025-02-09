import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IExternalInstance } from "@/interface/IExternalInstance";
import { execute as externalLibraryAddNewMovieClipUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewMovieClipUseCase";
import { execute as externalLibraryAddNewShapeUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewShapeUseCase";
import { execute as externalLibraryAddNewTextUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewTextUseCase";
import { execute as externalLibraryImportFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportFileUseCase";
import { execute as externalLibraryGetItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryGetItemUseCase";
import { execute as externalLibraryOutOfFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryOutOfFolderUseCase";
import { execute as externalLibraryMoveToFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryMoveToFolderUseCase";
import { execute as externalLibraryRemoveItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryRemoveItemUseCase";
import { execute as externalLibrarySelectedItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibrarySelectedItemUseCase";
import { execute as externalLibraryCreateNewFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryCreateNewFolderUseCase";
import { ExternalShape } from "@/external/core/domain/model/ExternalShape";
import { ExternalText } from "@/external/core/domain/model/ExternalText";

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
        externalLibraryImportFileUseCase(
            this._$workSpace, file, name, path, reload
        );
    }

    /**
     * @description 指定のライブラリアイテムを返却
     *              Returns specified library items
     *
     * @return {object | null}
     * @method
     * @public
     */
    getItem (path: string): IExternalInstance<any> | null
    {
        return externalLibraryGetItemUseCase(this._$workSpace, path);
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
        return externalLibraryOutOfFolderUseCase(
            this._$workSpace,
            item_path,
            reload
        );
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
        return externalLibraryMoveToFolderUseCase(
            this._$workSpace,
            folder_path,
            item_path,
            reload
        );
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
        externalLibrarySelectedItemUseCase(this._$workSpace, path_name);
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
    addNewFolder (path: string, reload: boolean = true): number
    {
        return externalLibraryCreateNewFolderUseCase(
            this._$workSpace,
            path,
            reload
        );
    }

    /**
     * @description 指定の階層に新規MovieClipを追加、階層が存在しなければフォルダを生成
     *              Add a new MovieClip to the specified hierarchy, or create a folder if the hierarchy does not exist
     *
     * @param  {string} path
     * @param  {boolean} [reload = true]
     * @return {void}
     * @method
     * @public
     */
    addNewMovieClip (path: string, reload: boolean = true): void
    {
        if (!path) {
            return ;
        }

        const paths = path.split("/");

        // 銭湯が空文字なら排除
        if (paths[0] === "") {
            paths.shift();
        }

        if (!paths.length) {
            return ;
        }

        const name = paths.pop() as NonNullable<string>;

        // フォルダー指定があれば先にフォルダーを生成
        let folderId = 0;
        if (paths.length) {
            folderId = this.addNewFolder(paths.join("/"), reload);
        }

        // 新規MovieClipを作成
        externalLibraryAddNewMovieClipUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            name, folderId, reload
        );
    }

    /**
     * @description 指定の階層に新規Textを追加、階層が存在しなければフォルダを生成
     *              Add a new Text to the specified hierarchy, or create a folder if the hierarchy does not exist
     *
     * @param  {string} path
     * @param  {number} width
     * @param  {number} height
     * @param  {boolean} [reload = true]
     * @return {ExternalShape}
     * @method
     * @public
     */
    addNewText (
        path: string,
        width: number,
        height: number,
        reload: boolean = true
    ): ExternalText | null {

        if (!path) {
            return null;
        }

        const paths = path.split("/");

        // 銭湯が空文字なら排除
        if (paths[0] === "") {
            paths.shift();
        }

        if (!paths.length) {
            return null;
        }

        const name = paths.pop() as NonNullable<string>;

        // フォルダー指定があれば先にフォルダーを生成
        let folderId = 0;
        if (paths.length) {
            folderId = this.addNewFolder(paths.join("/"), reload);
        }

        // 新規Shapeを作成
        const text = externalLibraryAddNewTextUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            name, width, height, folderId, reload
        );

        return new ExternalText(this._$workSpace, text);
    }

    /**
     * @description 指定の階層に新規Shapeを追加、階層が存在しなければフォルダを生成
     *              Add a new Shape to the specified hierarchy, or create a folder if the hierarchy does not exist
     *
     * @param  {string} path
     * @param  {boolean} [reload = true]
     * @return {ExternalShape}
     * @method
     * @public
     */
    addNewShape (
        path: string,
        reload: boolean = true
    ): ExternalShape | null {

        if (!path) {
            return null;
        }

        const paths = path.split("/");

        // 銭湯が空文字なら排除
        if (paths[0] === "") {
            paths.shift();
        }

        if (!paths.length) {
            return null;
        }

        const name = paths.pop() as NonNullable<string>;

        // フォルダー指定があれば先にフォルダーを生成
        let folderId = 0;
        if (paths.length) {
            folderId = this.addNewFolder(paths.join("/"), reload);
        }

        // 新規Shapeを作成
        const shape = externalLibraryAddNewShapeUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            name, folderId, reload
        );

        return new ExternalShape(this._$workSpace, shape);
    }

    /**
     * @description 指定のアイテムをライブラリエリアから削除
     *              Remove specified items from the library area
     *
     * @param  {string} path
     * @param  {boolean} [reload = true]
     * @return {Promise}
     * @method
     * @public
     */
    async removeItem (path: string, reload: boolean = true): Promise<void>
    {
        await externalLibraryRemoveItemUseCase(
            this._$workSpace, path, reload
        );
    }
}