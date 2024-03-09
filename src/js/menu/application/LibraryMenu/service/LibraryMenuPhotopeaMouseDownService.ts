import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import { $poolCanvas } from "@/global/GlobalUtil";

/**
 * @description Photopea連動処理
 *              Photopea-linked processing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    if (!libraryArea.selectedIds.length) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // メニューを全て閉じる
    $allHideMenu();

    const libraryId = libraryArea.selectedIds[0];
    const workSpace = $getCurrentWorkSpace();

    const instance: InstanceImpl<Bitmap> | null = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    instance
        .getHTMLElement()
        .then((canvas): void =>
        {
            const base64 = canvas.toDataURL(instance.imageType);

            $poolCanvas(canvas);

            const a  = document.createElement("a");
            a.href   = `https://www.photopea.com#${encodeURI(JSON.stringify({ "files": [base64] }))}`;
            a.target = "_blank";
            a.click();
        });
};