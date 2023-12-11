import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";

/**
 * @description タイムラインの全てのレイヤーを非表示にする
 *              Hide all layers in the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!element) {
        return ;
    }

    const children: HTMLCollection = element.children;

    const length = children.length;
    for (let idx = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        node.style.display = "none";
    }
};