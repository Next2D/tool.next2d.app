import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryGetItemUseCase } from "./ExternalLibraryGetItemUseCase";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryAreaAllClearElementService } from "@/controller/application/LibraryArea/service/LibraryAreaAllClearElementService";
import { execute as libraryAreaActiveElementService } from "@/controller/application/LibraryArea/service/LibraryAreaActiveElementService";
import { execute as externalLibrarySelectedOneService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibrarySelectedOneService";

/**
 * @description 指定のライブラリアイテムを選択状態にする
 *              Make the specified library item selected
 *
 * @param {WorkSpace} work_space
 * @param {string} path_name
 * @returns {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    path_name: string
): void => {

    const item = externalLibraryGetItemUseCase(work_space, path_name);
    if (!item) {
        return ;
    }

    // 選択中ならスキップ
    if (libraryArea.selectedIds.indexOf(item.id) > -1) {
        return ;
    }

    // 起動中のプロジェクトなら選択中のElementを初期化
    if (work_space.active) {
        libraryAreaAllClearElementService();
    }

    // 内部情報を更新
    externalLibrarySelectedOneService(item.id);

    // 起動中のプロジェクトなら指定のアイテムのElementをアクティブに更新
    if (work_space.active) {
        libraryAreaActiveElementService(item.id);
    }
};