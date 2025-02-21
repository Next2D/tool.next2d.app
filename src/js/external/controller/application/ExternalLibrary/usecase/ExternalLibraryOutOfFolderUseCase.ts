import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryGetItemUseCase } from "./ExternalLibraryGetItemUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as libraryAreaMoveFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUseCase";
import { execute as confirmModalInstanceDuplicateCheckService } from "@/menu/application/ConfirmModal/service/ConfirmModalInstanceDuplicateCheckService";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";

/**
 * @description 指定のアイテムをフォルダの外に移動、成功時はtrue、失敗時はfalseを返却
 *              Moves specified item out of folder, returns true on success, false on failure
 *
 * @param  {WorkSpace} work_space
 * @param  {string} item_path
 * @param  {boolean} reload
 * @return {boolean}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    item_path: string,
    reload: boolean = true
): Promise<boolean> => {

    const item = externalLibraryGetItemUseCase(work_space, item_path);
    if (!item || item.folderId === 0) {
        return false;
    }

    // フォルダの外に移動した時のパスを取得する
    const folderId = item.folderId;
    item.folderId = 0;

    // 重複をチェック
    if (confirmModalInstanceDuplicateCheckService(
        work_space,
        item.id,
        item.path
    )) {
        item.folderId = folderId;
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
        0
    );

    // フォルダの外(top)に移動
    item.folderId = 0;

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