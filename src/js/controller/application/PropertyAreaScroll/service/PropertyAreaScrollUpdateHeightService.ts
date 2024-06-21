import {
    $CONTROLLER_AREA_PROPERTY_BODY_ID,
    $PROPERTY_SCROLL_AREA_ID,
    $PROPERTY_SCROLL_BAR_ID
} from "@/config/PropertyConfig";
import { propertyArea } from "@/controller/domain/model/PropertyArea";

/**
 * @description プロパティエリアのスクロールバーの高さを更新する
 *              Update the height of the scrollbar in the property area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const scrollAreaElement: HTMLElement | null = document
        .getElementById($PROPERTY_SCROLL_AREA_ID);

    if (!scrollAreaElement) {
        return ;
    }

    const bodyElement: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_BODY_ID);

    if (!bodyElement) {
        return ;
    }

    const scrollBarElement: HTMLElement | null = document
        .getElementById($PROPERTY_SCROLL_BAR_ID);

    if (!scrollBarElement) {
        return ;
    }

    // スクロールバーの幅を算出
    propertyArea.scrollScale = scrollAreaElement.clientHeight / bodyElement.scrollHeight;
    if (1 > propertyArea.scrollScale) {

        scrollBarElement.style.display = "";
        scrollBarElement.style.top = `${Math.floor(bodyElement.scrollTop * propertyArea.scrollScale)}px`;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--property-scroll-bar-height",
                `${Math.floor(bodyElement.clientHeight * propertyArea.scrollScale) - 2}px`
            );

    } else {

        scrollBarElement.style.display = "none";

    }
};