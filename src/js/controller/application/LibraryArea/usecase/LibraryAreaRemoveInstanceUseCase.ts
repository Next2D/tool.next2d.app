import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 選択中のアイテムを全て削除
 *              Delete all selected items
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    if ("button" in event && event.button !== 0
        || $activeTouchPointers.size > 1
        || !libraryArea.selectedIds.length
    ) {
        return ;
    }

    // 全てのメニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLibrary = new ExternalLibrary(workSpace);

    // 選択中のアイテムを全て削除
    for (let idx = 0; idx < libraryArea.selectedIds.length; ++idx) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance = workSpace.getLibrary(libraryId);
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
    await libraryAreaReloadUseCase();

    // サウンドエリアの選択要素を再構築
    await soundAreaRebuildSelectElementService();
};