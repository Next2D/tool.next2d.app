import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ループ回数入力エリアのフォーカスイベント処理
 *              Focus event processing of loop count input area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const frame = movieClip.currentFrame;
    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    const index = parseInt(element.dataset.index as string);
    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    // 内部データを更新
    const externalSoundObject = new ExternalSoundObject(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index
    );
    externalSoundObject.loopCount = parseInt(element.value);
};