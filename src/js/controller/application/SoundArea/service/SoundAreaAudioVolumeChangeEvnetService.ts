import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";

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

    // 現在起動中のワークスペースとMovieClipを取得
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const currentFrame = movieClip.currentFrame;

    // 指定フレームの音声配列を取得
    const sounds = movieClip.getSound(currentFrame);
    if (!sounds) {
        return ;
    }

    const index = parseInt(audio.dataset.index as string);
    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    // 外部APIを起動
    const externalSoundObject = new ExternalSoundObject(
        workSpace,
        movieClip,
        soundObject,
        currentFrame,
        index
    );
    externalSoundObject.volume = Math.ceil(audio.volume * 100);
};