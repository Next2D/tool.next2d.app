import { $FOLDER_TYPE } from "@/config/InstanceConfig";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryAddNewFolderUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewFolderUseCase";
import { execute as externalLibraryGetItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryGetItemUseCase";

/**
 * @description 指定の階層に新規フォルダーを追加、階層が存在しなければフォルダを生成
 *              Add a new folder to the specified hierarchy, or create a folder if the hierarchy does not exist
 *
 * @param  {WorkSpace} work_space
 * @param  {string} path
 * @param  {boolean} [reload = true]
 * @return {number}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    path: string,
    reload: boolean = true
): number => {

    if (!path) {
        return 0;
    }

    const paths = path.split("/");

    // 銭湯が空文字なら排除
    if (paths[0] === "") {
        paths.shift();
    }

    const folderPaths: string[] = [];
    let folderId = 0;
    for (let idx = 0; idx < paths.length; ++idx) {

        const folderName = paths[idx];

        folderPaths.push(folderName);

        const instance = externalLibraryGetItemUseCase(work_space, folderPaths.join("/"));

        // フォルダがあればスキップ
        if (instance && instance.type === $FOLDER_TYPE) {
            folderId = instance.id;
            continue;
        }

        // 新規フォルダを作成
        const folder = externalLibraryAddNewFolderUseCase(
            work_space,
            work_space.scene,
            folderName, folderId, reload
        );

        // 次は自分が親になるので、IDを書き換え
        // fixed logic
        folderId = folder.id;
    }

    return folderId;
};