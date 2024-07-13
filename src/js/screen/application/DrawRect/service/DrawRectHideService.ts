import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";

/**
 * @description 範囲選択を非表示に更新
 *              Update the range selection to be hidden
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_DRAW_RECT_ID);

    if (!element) {
        return ;
    }

    element.setAttribute("style", "display: none;");
};