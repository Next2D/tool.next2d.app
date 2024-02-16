import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";

/**
 * @description ライブラリエリア内でのインスタンス移動処理
 *              Instance movement processing within the library area
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    let reload = false;

    const length = libraryArea.selectedIds.length;
    if ("libraryId" in element.dataset) {

        const libraryId = parseInt(element.dataset.libraryId as string);
        const instance = workSpace.getLibrary(libraryId);
        if (!instance) {
            return ;
        }

        const folderId = instance.type === "folder" ? instance.id : instance.folderId;
        for (let idx = 0; idx < length; ++idx) {

            const libraryId = libraryArea.selectedIds[idx];

            // 自分ならスキップ
            if (folderId === libraryId) {
                continue;
            }

            const selectedInstance = workSpace.getLibrary(libraryId);
            if (!selectedInstance || selectedInstance.folderId === folderId) {
                continue;
            }

            if (instance.type === "folder"
                && instance.duplicateFolderId(workSpace, selectedInstance.id)
            ) {
                continue;
            }

            // ドロップ先のfolderIdを利用
            selectedInstance.folderId = folderId;

            reload = true;
        }

    } else {

        for (let idx = 0; idx < length; ++idx) {

            const libraryId = libraryArea.selectedIds[idx];

            const selectedInstance = workSpace.getLibrary(libraryId);
            if (!selectedInstance || selectedInstance.folderId === 0) {
                continue;
            }

            // フォルダ情報を更新
            selectedInstance.folderId = 0;

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
    }

};