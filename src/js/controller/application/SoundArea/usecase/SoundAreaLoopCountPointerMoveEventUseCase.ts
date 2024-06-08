import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp, $setCursor } from "@/global/GlobalUtil";

/**
 * @description ループ回数操作を開始
 *              Start loop count operation
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    $setCursor("ew-resize");

    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const sounds = movieClip.getSound(movieClip.currentFrame);
        if (!sounds) {
            return ;
        }

        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を変更
        element.value = `${$clamp(parseInt(element.value) + event.movementX, 0, 65535)}`;
    });
};