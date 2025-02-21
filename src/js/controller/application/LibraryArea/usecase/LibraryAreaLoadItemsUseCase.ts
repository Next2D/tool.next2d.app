import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as libraryAreaScanFileUseCase } from "./LibraryAreaScanFileUseCase";
import { execute as libraryAreaReOrderingService } from "../service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "./LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";
import { execute as confirmModalFileResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileResetService";
import { execute as confirmModalFileShowUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalFileShowUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";
import { $replace } from "@/language/application/LanguageUtil";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

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
    progressMenuUpdateMessageService($replace("{{外部ファイルの読み込み}}"));

    const workSpace = $getCurrentWorkSpace();

    let path = "";
    if (libraryArea.selectedIds.length === 1) {
        const instance = workSpace.getLibrary(libraryArea.selectedIds[0]);
        if (instance && instance.type === $FOLDER_TYPE) {
            path = instance.getPath(workSpace);
        }
    }

    // ファイルはawaitすると取得できないので、最後にPromise.allでまとめて処理
    // fixed logic
    const promises = [];
    for (let idx = 0; idx < items.length; ++idx) {

        const entry: FileSystemEntry | null = items[idx].webkitGetAsEntry();
        if (!entry) {
            continue;
        }

        // ファイルクラスをスキャン
        promises.push(libraryAreaScanFileUseCase(entry, path));
    }

    // fixed logic
    await Promise.all(promises);

    // 選択状態を初期化
    libraryAreaSelectedClearUseCase();

    // ファイル名で昇順に並び替え
    libraryAreaReOrderingService(workSpace);

    // ライブラリエリアを再描画
    await libraryAreaReloadUseCase();

    // サウンドエリアの選択要素を再構築
    await soundAreaRebuildSelectElementService();

    // プログレバーを非表示に更新
    progressMenuHideService();

    // 重複があればモーダルを表示
    confirmModalFileShowUseCase();
};