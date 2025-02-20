import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as libraryPreviewAreaUpdateDisplayUseCase } from "@/controller/application/LibraryPreviewArea/usecase/LibraryPreviewAreaUpdateDisplayUseCase";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";
import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";
import {
    $LIBRARY_LIST_BOX_SCROLL_AREA_ID,
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "@/config/LibraryConfig";

/**
 * @description ラリブラリのキーダウンイベントの処置関数
 *              Treatment function for keydown events in the RALIBRARY
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
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
            if (instance.type !== $FOLDER_TYPE) {
                await libraryPreviewAreaUpdateDisplayUseCase(instance);
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
        if (instance.type !== $FOLDER_TYPE) {
            await libraryPreviewAreaUpdateDisplayUseCase(instance);
        } else {
            libraryPreviewAreaClearDisplayService();
        }

        externalLibrary.selectedItem(instance.getPath(workSpace));

        // スクロール位置を調整
        const scrollAreaElement: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_SCROLL_AREA_ID);

        if (!scrollAreaElement) {
            return ;
        }

        const listBoxElement: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_ID);

        if (!listBoxElement) {
            return ;
        }

        const offsetY = prevElement.offsetTop - listBoxElement.offsetTop;
        if (offsetY < listBoxElement.scrollTop) {
            const scrollBarElement: HTMLElement | null = document
                .getElementById($LIBRARY_LIST_BOX_SCROLL_BAR_ID);

            if (!scrollBarElement) {
                return ;
            }

            listBoxElement.scrollTop -= prevElement.clientHeight;
            scrollBarElement.style.top = `${listBoxElement.scrollTop * libraryArea.scrollScale}px`;
        }
    }
};