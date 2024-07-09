import { $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { stageRect } from "@/screen/domain/model/StageRect";

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
            .getElementById($SCREEN_STAGE_RECT_ID);

        if (!element) {
            return ;
        }

        if (stageRect.x > event.pageX) {
            element.style.left = `${event.pageX}px`;
        }

        if (stageRect.y > event.pageY) {
            element.style.top = `${event.pageY}px`;
        }

        element.style.width  = `${Math.abs(event.pageX - stageRect.x)}px`;
        element.style.height = `${Math.abs(event.pageY - stageRect.y)}px`;
    });
};