import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description ステージエリアの全DisplayObjectを非アクティブ化
 *              Deactivate all DisplayObjects in the stage area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const children = element.children;
    const length = children.length;
    for (let idx = 0; idx < length; ++idx) {

        const child = children[idx] as HTMLElement;
        if (!child) {
            continue;
        }

        child.style.pointerEvents = "none";

        if (!child.classList.contains("display-object")) {
            continue ;
        }

        const container = child.querySelector(".canvas-container") as HTMLDivElement;
        if (!container) {
            return ;
        }

        container.style.pointerEvents = "none";
    }
};