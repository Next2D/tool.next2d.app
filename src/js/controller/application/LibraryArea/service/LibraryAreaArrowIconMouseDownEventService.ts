import type { Folder } from "@/core/domain/model/Folder";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";

/**
 * @description フォルダーのアローアイコンを操作
 *              Manipulate the folder's Arrow icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントでアイテム選択処理を行うので、ここではstop関数を実行しない
    // @see LibraryAreaSelectedMouseDownUseCase

    const libraryId = parseInt(element.dataset.libraryId as string);
    const workSpace = $getCurrentWorkSpace();
    const folder: InstanceImpl<Folder> = workSpace.getLibrary(libraryId);

    const externalFolder = new ExternalFolder(workSpace, folder);
    if (folder.mode === "close") {
        externalFolder.open();
    } else {
        externalFolder.close();
    }
};