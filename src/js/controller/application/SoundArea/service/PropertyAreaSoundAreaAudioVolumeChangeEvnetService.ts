import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description サウンド設定の音量変更イベント
 *              Sound setting volume change event
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const audio = event.currentTarget as HTMLAudioElement;
    if (!audio) {
        return ;
    }

    const index = parseInt(audio.dataset.index as string);
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const sounds = movieClip.getSound(movieClip.currentFrame);
    if (!sounds) {
        return ;
    }

    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    soundObject.volume = Math.ceil(audio.volume * 100);
    console.log(soundObject);
};