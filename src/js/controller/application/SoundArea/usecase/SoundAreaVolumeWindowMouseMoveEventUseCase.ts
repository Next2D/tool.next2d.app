import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp } from "@/global/GlobalUtil";
import { $getTargetElement } from "../SoundAreaUtil";

/**
 * @description 音量操作を開始
 *              Start volume operation
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

    requestAnimationFrame((): void =>
    {
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const sounds = movieClip.getSound(movieClip.currentFrame);
        if (!sounds) {
            return ;
        }

        const element = $getTargetElement();
        if (!element) {
            return ;
        }

        const volume = parseInt(element.value);

        // 表示を更新
        element.value = `${$clamp(volume + event.movementX, 0, 100)}`;
    });
};