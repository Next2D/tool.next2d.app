import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as confirmModalInstaceResetService } from "@/menu/application/ConfirmModal/service/ConfirmModalInstaceResetService";
import { execute as confirmModalinstanceShowUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalinstanceShowUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";
import { Folder } from "@/core/domain/model/Folder";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";
import { execute as screenStageAreaAllDisplayObjectActiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectActiveService";

/**
 * @description ライブラリエリア内でのインスタンス移動処理
 *              Instance movement processing within the library area
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 重複チェックの配列を初期化
    confirmModalInstaceResetService();

    const workSpace = $getCurrentWorkSpace();

    // 外部APIを起動
    const externalLibrary = new ExternalLibrary(workSpace);

    let reload = false;

    const length = libraryArea.selectedIds.length;

    // 移動先がアイテムを選択している時
    if ("libraryId" in element.dataset) {

        const libraryId = parseInt(element.dataset.libraryId as string);
        const instance = workSpace.getLibrary(libraryId);
        if (!instance) {
            return ;
        }

        const folder = instance.type === $FOLDER_TYPE
            ? instance
            : workSpace.getLibrary(instance.folderId) as Folder;

        for (let idx = 0; idx < length; ++idx) {

            const libraryId = libraryArea.selectedIds[idx];

            // 自分ならスキップ
            if (instance.id === libraryId) {
                continue;
            }

            const selectedInstance = workSpace.getLibrary(libraryId);
            if (!selectedInstance) {
                continue;
            }

            // 移動する先がフォルダで、選択中のインスタンスがフォルダの時は
            // 親フォルダの配下にないかをチェック
            if (folder) {
                const result = externalLibrary.moveToFolder(
                    folder.getPath(workSpace),
                    selectedInstance.getPath(workSpace),
                    false
                );

                // 移動してない時はスキップ
                if (!result) {
                    continue;
                }
            } else {
                // 移動先がフォルダでない時は、フォルダから移動
                const result = externalLibrary.outOfFolder(
                    selectedInstance.getPath(workSpace),
                    false
                );

                // 移動してない時はスキップ
                if (!result) {
                    continue;
                }
            }

            reload = true;
        }

    } else {

        // 何も指定がない時は一番上の階層に移動
        for (let idx = 0; idx < length; ++idx) {

            const libraryId = libraryArea.selectedIds[idx];

            const selectedInstance = workSpace.getLibrary(libraryId);
            if (!selectedInstance) {
                continue;
            }

            const result = externalLibrary.outOfFolder(
                selectedInstance.getPath(workSpace),
                false
            );

            // 移動してない時はスキップ
            if (!result) {
                continue;
            }

            reload = true;
        }
    }

    if (reload) {

        // path mapを再生成
        workSpaceCreatePathMapService(workSpace);

        // ソートを実行
        libraryAreaReOrderingService(workSpace);

        // 再描画
        libraryAreaReloadUseCase();

        // サウンドリストを再描画
        soundAreaRebuildSelectElementService();
    }

    // 重複があればモーダルを表示
    confirmModalinstanceShowUseCase();

    // 全てのオブジェクトをアクティブにする
    screenStageAreaAllDisplayObjectActiveService();
};