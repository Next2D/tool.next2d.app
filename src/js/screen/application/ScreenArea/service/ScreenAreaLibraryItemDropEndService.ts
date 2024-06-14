import { $SCREEN_ID } from "@/config/ScreenConfig";

/**
 * @description スクリーンエリアのアイテムドロップ終了処理関数
 *              Item drop end processing function for screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_ID);

    if (!element) {
        return ;
    }
    element.style.overflow = "";

    const children = element.children;
    const length = children.length;
    for (let idx = 0; idx < length; ++idx) {
        const node = children[idx] as HTMLElement;
        node.style.pointerEvents = "";
    }
};