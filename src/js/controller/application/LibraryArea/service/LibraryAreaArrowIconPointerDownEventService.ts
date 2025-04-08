import type { Folder } from "@/core/domain/model/Folder";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

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

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 変更中の要素を初期化
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const externalFolder = new ExternalFolder(workSpace, folder);
    if (folder.mode === "close") {
        await externalFolder.open();
    } else {
        await externalFolder.close();
    }
};