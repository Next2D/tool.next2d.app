import { $poolCanvas } from "@/global/GlobalUtil";
import { $LIBRARY_PREVIEW_AREA_ID } from "@/config/LibraryConfig";

/**
 * @description ライブラリエリアのプレビュー表示を初期化
 *              Initialize preview display in library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_PREVIEW_AREA_ID);

    if (!element) {
        return ;
    }

    while (element.firstElementChild) {

        const firstElementChild = element.firstElementChild;
        if (firstElementChild instanceof HTMLCanvasElement) {
            $poolCanvas(firstElementChild);
        }

        element.classList.remove("preview-center");
        firstElementChild.remove();
    }
};