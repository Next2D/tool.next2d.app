import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { $getTargetIndex } from "../SoundAreaUtil";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";

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

    requestAnimationFrame((): void =>
    {
        $setCursor("ew-resize");

        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const sounds = movieClip.getSound(movieClip.currentFrame);
        if (!sounds) {
            return ;
        }

        const element: HTMLElement | null = document
            .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

        if (!element) {
            return ;
        }

        const index = $getTargetIndex();
        const node = element.children[index];
        if (!node) {
            return ;
        }

        const loopElement = node.querySelector(".loop-count") as HTMLInputElement;
        if (!loopElement) {
            return ;
        }

        // 表示を変更
        loopElement.value = `${$clamp(parseInt(loopElement.value) + event.movementX, 0, 65535)}`;
    });
};