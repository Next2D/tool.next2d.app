import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";
import { soundArea } from "@/controller/domain/model/SoundArea";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 音量操作を開始
 *              Start volume operation
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示とaudioの音量を変更
        const volume = $clamp(parseInt(element.value) + event.movementX, 0, 100);
        element.value = `${volume}`;

        const parent: HTMLElement | null = document
            .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

        if (!parent) {
            return ;
        }

        const node = parent.children[soundArea.targetIndex];
        if (!node) {
            return ;
        }

        const audio = node.querySelector("audio") as HTMLAudioElement;
        if (!audio) {
            return ;
        }

        audio.volume = volume / 100;
    });
};