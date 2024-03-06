import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as libraryPreviewAreaUpdateDisplayUseCase } from "@/controller/application/LibraryPreviewArea/usecase/LibraryPreviewAreaUpdateDisplayUseCase";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";
import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";

/**
 * @description ラリブラリのキーダウンイベントの処置関数
 *              Treatment function for keydown events in the RALIBRARY
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();

    // ライブラリに何もなければ終了
    if (2 > workSpace.libraries.size) {
        return ;
    }

    const externalLibrary = new ExternalLibrary(workSpace);
    if (!libraryArea.selectedIds.length) {

        for (const [path, libraryId] of workSpace.pathMap) {

            // rootならスキップ
            if (!libraryId) {
                continue;
            }

            const instance = workSpace.getLibrary(libraryId);
            if (!instance) {
                return ;
            }

            // フォルダーのインスタンスでなければ、プレビューエリアを更新
            if (instance.type !== "folder") {
                libraryPreviewAreaUpdateDisplayUseCase(instance);
            } else {
                libraryPreviewAreaClearDisplayService();
            }

            externalLibrary.selectedItem(path);
            break;
        }

    } else {

        const libraryId = libraryArea.selectedIds[libraryArea.selectedIds.length - 1];

        const selectedElement: HTMLElement | null = document
            .getElementById(`library-child-id-${libraryId}`);

        if (!selectedElement) {
            return ;
        }

        const prevElement = selectedElement.previousElementSibling as HTMLElement;
        if (!prevElement) {
            return ;
        }

        const prevLibraryId = parseInt(prevElement.dataset.libraryId as string);
        const instance = workSpace.getLibrary(prevLibraryId);
        if (!instance) {
            return ;
        }

        // 選択を初期化
        libraryAreaSelectedClearUseCase();

        // フォルダーのインスタンスでなければ、プレビューエリアを更新
        if (instance.type !== "folder") {
            libraryPreviewAreaUpdateDisplayUseCase(instance);
        } else {
            libraryPreviewAreaClearDisplayService();
        }

        externalLibrary.selectedItem(instance.getPath(workSpace));
    }
};