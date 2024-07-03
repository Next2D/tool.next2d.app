import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $LIBRARY_PREVIEW_AREA_ID } from "@/config/LibraryConfig";
import { execute as libraryPreviewAreaClearDisplayService } from "../service/LibraryPreviewAreaClearDisplayService";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description
 *
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = async (instance: InstanceImpl<any>): Promise<void> =>
{
    const previewElement: HTMLElement | null = document
        .getElementById($LIBRARY_PREVIEW_AREA_ID);

    if (!previewElement) {
        return ;
    }

    if (libraryArea.selectedId === instance.id) {
        return ;
    }

    libraryArea.selectedId = instance.id;

    // プレビューエリアを初期化
    libraryPreviewAreaClearDisplayService();

    const element: HTMLElement | null = await instance.getHTMLElement();
    if (!element) {
        return ;
    }

    element.classList.add("preview-center");
    previewElement.appendChild(element);
};