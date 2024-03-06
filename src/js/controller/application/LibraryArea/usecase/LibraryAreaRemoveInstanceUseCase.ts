import type { Instance } from "@/core/domain/model/Instance";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description 選択中のアイテムを全て削除
 *              Delete all selected items
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    if (!libraryArea.selectedIds.length) {
        return ;
    }

    // 全てのメニューを非表示
    $allHideMenu();

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLibrary = new ExternalLibrary(workSpace);

    // 選択中のアイテムを全て削除
    for (let idx = 0; idx < libraryArea.selectedIds.length; ++idx) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance: InstanceImpl<Instance> | null = workSpace.getLibrary(libraryId);
        if (!instance) {
            continue;
        }

        // 削除処理を実行
        await externalLibrary
            .removeItem(instance.getPath(workSpace), false);
    }

    // 選択状態を初期化
    libraryAreaSelectedClearUseCase();

    // ライブラリエリアを際描画
    libraryAreaReloadUseCase();
};