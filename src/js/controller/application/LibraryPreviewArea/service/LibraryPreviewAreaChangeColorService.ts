import { $LIBRARY_PREVIEW_AREA_ID } from "@/config/LibraryConfig";

/**
 * @description ライブラリのプレビューエリアの背景色を更新
 *              Updated background color of library preview area
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (color: string): void =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_PREVIEW_AREA_ID);

    if (!element) {
        return ;
    }

    element.style.backgroundColor = color;
};