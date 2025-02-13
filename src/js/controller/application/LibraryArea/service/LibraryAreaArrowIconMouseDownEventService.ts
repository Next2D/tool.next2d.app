import type { Folder } from "@/core/domain/model/Folder";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

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
    if (event.button !== 0 || $useKeyboard()) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const libraryId = parseInt(element.dataset.libraryId as string);
    const workSpace = $getCurrentWorkSpace();
    const folder = workSpace.getLibrary(libraryId) as Folder;
    if (!folder) {
        return ;
    }

    const externalFolder = new ExternalFolder(workSpace, folder);
    if (folder.mode === "close") {
        externalFolder.open();
    } else {
        externalFolder.close();
    }
};