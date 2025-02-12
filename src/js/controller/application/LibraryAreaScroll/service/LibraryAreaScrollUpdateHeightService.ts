import { libraryArea } from "@/controller/domain/model/LibraryArea";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_AREA_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "@/config/LibraryConfig";

/**
 * @description ライブラリエリアのスクロールバーの高さを更新する
 *              Update the height of the scrollbar in the library area
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const scrollAreaElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_SCROLL_AREA_ID);

    if (!scrollAreaElement) {
        return ;
    }

    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!listBoxElement) {
        return ;
    }

    const scrollBarElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_SCROLL_BAR_ID);

    if (!scrollBarElement) {
        return ;
    }

    // スクロールバーの幅を算出
    libraryArea.scrollScale = scrollAreaElement.clientHeight / listBoxElement.scrollHeight;
    if (1 > libraryArea.scrollScale) {

        scrollBarElement.style.display = "";
        scrollBarElement.style.top = `${Math.floor(listBoxElement.scrollTop * libraryArea.scrollScale)}px`;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--library-list-box-scroll-bar-height",
                `${Math.floor(listBoxElement.clientHeight * libraryArea.scrollScale) - 2}px`
            );

    } else {

        scrollBarElement.style.display = "none";

    }
};