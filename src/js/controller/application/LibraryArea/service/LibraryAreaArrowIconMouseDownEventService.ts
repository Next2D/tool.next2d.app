import type { Folder } from "@/core/domain/model/Folder";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import {
    $activeTouchPointers,
    $getEditingElement,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description フォルダーのアローアイコンを操作
 *              Manipulate the folder's Arrow icon
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0 || $activeTouchPointers.size > 1) {
        return ;
    }

    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const libraryId = parseInt(element.dataset.libraryId as string);
    const workSpace = $getCurrentWorkSpace();
    const folder = workSpace.getLibrary(libraryId) as Folder;
    if (!folder) {
        return ;
    }

    const externalFolder = new ExternalFolder(workSpace, folder);
    if (folder.mode === "close") {
        await externalFolder.open();
    } else {
        await externalFolder.close();
    }
};