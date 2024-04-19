import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { $getTargetIndex } from "../SoundAreaUtil";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";

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

        const volumeElement = node.querySelector(".volume") as HTMLInputElement;
        if (!volumeElement) {
            return ;
        }

        const audio = node.querySelector("audio");
        if (!audio) {
            return ;
        }

        // 表示とaudioの音量を変更
        const currentVolume = parseInt(volumeElement.value);
        const volume = $clamp(currentVolume + event.movementX, 0, 100);
        audio.volume = volume / 100;
        volumeElement.value = `${volume}`;
    });
};