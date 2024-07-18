import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { drawRect } from "@/screen/domain/model/DrawRect";

/**
 * @description 描画の範囲選択のマウスムーブイベント
 *              Mouse-move event of drawing range selection
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

        const width  = Math.abs(event.offsetX - drawRect.x);
        const height = Math.abs(event.offsetY - drawRect.y);

        // シフトキーが押されている時は正方形にする
        if (event.shiftKey) {
            const minSize = Math.min(width, height);
            element.style.width  = `${minSize}px`;
            element.style.height = `${minSize}px`;
        } else {
            element.style.width  = `${width}px`;
            element.style.height = `${height}px`;
        }
    });
};