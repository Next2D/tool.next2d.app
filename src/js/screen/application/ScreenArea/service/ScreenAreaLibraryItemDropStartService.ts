import { $SCREEN_ID } from "@/config/ScreenConfig";

/**
 * @description スクリーンエリアのアイテムドロップ開始処理関数
 *              Item drop start processing function for screen area
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

    // スクリーンエリアの親要素のイベントを無効化する
    const children = element.children as HTMLCollectionOf<HTMLElement>;
    const length = children.length;
    for (let idx = 0; idx < length; ++idx) {
        const node = children[idx];
        if (!node) {
            continue ;
        }

        // pointer-eventsをnoneに設定して、スクリーン上の要素のイベントを無効化する
        node.style.pointerEvents = "none";
    }

    // スクリーンエリアに配置されている、DisplayObjectのイベント無効化する
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

        container.style.pointerEvents = "none";
    }
};