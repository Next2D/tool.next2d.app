import { $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { $getPositon } from "../StageRectUtil";

/**
 * @description 範囲選択のマウスムーブイベントの実行関数
 *              Execution function of the mouse-move event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = document
            .getElementById($SCREEN_STAGE_RECT_ID);

        if (!element) {
            return ;
        }

        const position = $getPositon();

        if (position.x > event.pageX) {
            element.style.left = `${event.pageX}px`;
        }

        if (position.y > event.pageY) {
            element.style.top = `${event.pageY}px`;
        }

        element.style.width  = `${Math.abs(event.pageX - position.x)}px`;
        element.style.height = `${Math.abs(event.pageY - position.y)}px`;
    });
};