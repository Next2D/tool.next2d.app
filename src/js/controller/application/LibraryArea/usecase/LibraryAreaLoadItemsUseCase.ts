import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as libraryAreaScanFileUseCase } from "./LibraryAreaScanFileUseCase";
import { execute as libraryAreaReOrderingService } from "../service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "./LibraryAreaReloadUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // アクティブなプロジェクトならプログレバーを表示
    progressMenuShowService();

    // 進行状況のテキストを更新
    progressMenuUpdateMessageService("{{外部ファイルの読み込み}}");

    for (let idx = 0; idx < items.length; ++idx) {

        const entry: FileSystemEntry | null = items[idx].webkitGetAsEntry();
        if (!entry) {
            continue;
        }

        // ファイルクラスをスキャン
        await libraryAreaScanFileUseCase(entry);
    }

    // ファイル名で昇順に並び替え
    libraryAreaReOrderingService($getCurrentWorkSpace());

    // ライブラリエリアを際描画
    libraryAreaReloadUseCase();

    // プログレバーを非表示に更新
    progressMenuHideService();
};