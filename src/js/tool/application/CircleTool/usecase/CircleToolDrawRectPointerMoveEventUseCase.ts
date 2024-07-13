import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { drawRect } from "@/screen/domain/model/DrawRect";

/**
 * @description 拡大の範囲選択のマウスムーブイベントの実行関数
 *              Execution function of the mouse-move event of the range selection of the zoom
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
            .getElementById($SCREEN_DRAW_RECT_ID);

        if (!element) {
            return ;
        }

        if (drawRect.x > event.offsetX) {
            element.style.left = `${event.offsetX}px`;
        }

        if (drawRect.y > event.offsetY) {
            element.style.top = `${event.offsetY}px`;
        }

        element.style.width  = `${Math.abs(event.offsetX - drawRect.x)}px`;
        element.style.height = `${Math.abs(event.offsetY - drawRect.y)}px`;
    });
};