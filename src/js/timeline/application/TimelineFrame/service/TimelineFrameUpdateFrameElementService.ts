import { $TIMELINE_CURRENT_FRAME_ID } from "@/config/TimelineConfig";

/**
 * @description タイムラインのフレーム表示を更新
 *              Updated timeline frame display
 *
 * @param {number} frame
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TIMELINE_CURRENT_FRAME_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${frame}`;
};