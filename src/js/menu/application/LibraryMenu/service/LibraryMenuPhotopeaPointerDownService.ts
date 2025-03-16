import type { Bitmap } from "@/core/domain/model/Bitmap";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $poolCanvas } from "@/global/GlobalUtil";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description Photopea連動処理
 *              Photopea-linked processing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !libraryArea.selectedIds.length
    ) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て閉じる
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    const libraryId = libraryArea.selectedIds[0];
    const workSpace = $getCurrentWorkSpace();

    const instance = workSpace.getLibrary(libraryId) as Bitmap;
    if (!instance) {
        return ;
    }

    const canvas = await instance.getHTMLElement();
    const base64 = canvas.toDataURL(instance.imageType);
    $poolCanvas(canvas);

    const a  = document.createElement("a");
    a.href   = `https://www.photopea.com#${encodeURI(JSON.stringify({ "files": [base64] }))}`;
    a.target = "_blank";
    a.click();
};