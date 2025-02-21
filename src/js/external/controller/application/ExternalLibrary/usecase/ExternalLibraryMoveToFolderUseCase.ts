import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as libraryAreaMoveFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUseCase";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";
import { execute as externalLibraryGetItemUseCase } from "./ExternalLibraryGetItemUseCase";

/**
 * @description 指定のフォルダに指定のアイテムを移動、成功時はtrue、失敗時はfalseを返却
 *              Move the specified item to the specified folder, returning true on success, false on failure
 *
 * @param  {WorkSpace} work_space
 * @param  {string} folder_path
 * @param  {string} item_path
 * @param  {boolean} [reload = true]
 * @return {boolean}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    folder_path: string,
    item_path: string,
    reload: boolean = true
): Promise<boolean> => {

    const folder = externalLibraryGetItemUseCase(work_space, folder_path);
    if (!folder) {
        return false;
    }

    const item = externalLibraryGetItemUseCase(work_space, item_path);
    if (!item) {
        return false;
    }

    if (item.folderId === folder.id) {
        return false;
    }

    // 移動するアイテムがフォルダの場合は、親階層のフォルダと重複してないかチェックする
    if (item.type === $FOLDER_TYPE
        && (folder as ExternalFolder).checkDuplicate(item.id)
    ) {
        return false;
    }

    const instance = work_space.getLibrary(item.id);
    if (!instance) {
        return false;
    }

    // 履歴に残す
    // fixed logic
    await libraryAreaMoveFolderHistoryUseCase(
        work_space,
        work_space.scene,
        instance,
        folder.id
    );

    // フォルダ内に格納
    item.folderId = folder.id;

    // 再読み込みがonなら再生成
    if (reload) {
        workSpaceCreatePathMapService(work_space);

        // ソートを実行
        libraryAreaReOrderingService(work_space);

        // アクティブなプロジェクトなら再描画
        if (work_space.active) {
            await libraryAreaReloadUseCase();
        }
    }

    return true;
};