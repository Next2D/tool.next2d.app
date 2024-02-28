import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as confirmModalFileResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileResetService";
import { execute as confirmModalFileShowUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalFileShowUseCase";
import { execute as confirmModalFileDuplicateCheckService } from "@/menu/application/ConfirmModal/service/ConfirmModalFileDuplicateCheckService";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @description 外部ファイル読み込み処理関数
 *              External file read processing function
 *
 * @param  {Event} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: Event): Promise<void> =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 外部ファイルの読み込み
    const files: FileList | null = element.files;
    if (!files) {
        return ;
    }

    event.preventDefault();
    event.stopPropagation();

    // 重複チェックの配列を初期化
    confirmModalFileResetService();

    // アクティブなプロジェクトならプログレバーを表示
    progressMenuShowService();

    // 進行状況のテキストを更新
    progressMenuUpdateMessageService($replace("{{外部ファイルの読み込み}}"));

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLibrary = new ExternalLibrary(workSpace);

    let path = "";
    if (libraryArea.selectedIds.length === 1) {
        const instance = workSpace.getLibrary(libraryArea.selectedIds[0]);
        if (instance && instance.type === "folder") {
            path = instance.getPath(workSpace);
        }
    }

    // 選択したファイルを読み込む
    for (let idx: number = 0; idx < files.length; ++idx) {

        const file = files[idx];

        // 重複していればスキップ
        if (confirmModalFileDuplicateCheckService(workSpace, file, path)) {
            continue;
        }

        const names = file.name.split(".");
        names.pop();
        const name = names.join(".");

        await externalLibrary
            .importFile(file, name, path, false);

    }

    // ファイル名で昇順に並び替え
    libraryAreaReOrderingService(workSpace);

    // ライブラリエリアを際描画
    libraryAreaReloadUseCase();

    // プログレバーを非表示に更新
    progressMenuHideService();

    // 重複があればモーダルを表示
    confirmModalFileShowUseCase();
};