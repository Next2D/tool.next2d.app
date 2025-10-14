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

    // スクリーンエリアの親要素のイベントを無効化を解除する
    const children = element.children;
    const length = children.length;
    for (let idx = 0; idx < length; ++idx) {
        const node = children[idx] as HTMLElement;
        node.style.pointerEvents = "";
    }

    // スクリーンエリアに配置されている、DisplayObjectのイベント無効化を解除する
    const elements = element
        .querySelectorAll(".display-object") as NodeListOf<HTMLElement>;

    const count = elements.length;
    for (let idx = 0; idx < count; ++idx) {

        const displayObject = elements[idx];
        if (!displayObject) {
            continue ;
        }

        const container = displayObject.querySelector(".canvas-container") as HTMLDivElement;
        if (!container) {
            return ;
        }

        container.style.pointerEvents = "";
    }
};