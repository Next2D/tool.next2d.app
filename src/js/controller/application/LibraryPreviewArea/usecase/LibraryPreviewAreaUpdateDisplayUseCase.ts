import { $poolCanvas } from "@/global/GlobalUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $LIBRARY_PREVIEW_AREA_ID } from "@/config/LibraryConfig";
import { execute as libraryPreviewAreaClearDisplayService } from "../service/LibraryPreviewAreaClearDisplayService";

/**
 * @description
 *
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<any>): void =>
{
    const previewElement: HTMLElement | null = document
        .getElementById($LIBRARY_PREVIEW_AREA_ID);

    if (!previewElement) {
        return ;
    }

    libraryPreviewAreaClearDisplayService();

    instance
        .getHTMLElement()
        .then((element: HTMLElement | null): void =>
        {
            if (!element) {
                return ;
            }

            previewElement.appendChild(element);
        });
};