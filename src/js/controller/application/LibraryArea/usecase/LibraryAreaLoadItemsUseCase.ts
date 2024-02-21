import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as libraryAreaScanFileUseCase } from "./LibraryAreaScanFileUseCase";
import { execute as libraryAreaReOrderingService } from "../service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "./LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as confirmModalFileResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileResetService";
import { execute as confirmModalFileShowUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalFileShowUseCase";

/**
 * @description 外部アイテムの読み込み実行関数
 *              Functions for loading and executing external items
 *
 * @param  {DataTransferItemList} items
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (items: DataTransferItemList): Promise<void> =>
{
    // 重複チェックの配列を初期化
    confirmModalFileResetService();

    // アクティブなプロジェクトならプログレバーを表示
    progressMenuShowService();

    // 進行状況のテキストを更新
    progressMenuUpdateMessageService("{{外部ファイルの読み込み}}");

    const workSpace = $getCurrentWorkSpace();

    let path = "";
    if (libraryArea.selectedIds.length === 1) {
        const instance = workSpace.getLibrary(libraryArea.selectedIds[0]);
        if (instance && instance.type === "folder") {
            path = instance.getPath(workSpace);
        }
    }

    for (let idx = 0; idx < items.length; ++idx) {

        const entry: FileSystemEntry | null = items[idx].webkitGetAsEntry();
        if (!entry) {
            continue;
        }

        // ファイルクラスをスキャン
        await libraryAreaScanFileUseCase(entry, path);
    }

    // ファイル名で昇順に並び替え
    libraryAreaReOrderingService(workSpace);

    // 選択状態を初期化
    libraryAreaSelectedClearUseCase();

    // ライブラリエリアを際描画
    libraryAreaReloadUseCase();

    // プログレバーを非表示に更新
    progressMenuHideService();

    // 重複があればモーダルを表示
    confirmModalFileShowUseCase();
};