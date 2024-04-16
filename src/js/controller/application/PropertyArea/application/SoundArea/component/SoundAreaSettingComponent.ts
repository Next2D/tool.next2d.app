import type { Sound } from "@/core/domain/model/Sound";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";

/**
 * @description サウンドエリアの個別設定のElementをstringで返却
 *              Returns the Element of individual settings in the sound area as a string
 *
 * @param  {number} id
 * @param  {Sound} sound
 * @param  {object} sound_object
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    id: number,
    sound: Sound,
    sound_object: SoundObjectImpl
): string => {
    return `
<div id="sound-id-${id}" class="sound-border">
    <div class="sound-title">
      <span id="sound-name-${id}" data-sound-id="${id}">${sound.name}</span>
      <i class="trash" id="sound-trash-${id}" data-sound-id="${id}" data-detail="{{サウンドを削除}}"></i>
    </div>

    <div class="sound-container">
        <div class="sound-setting-container">
            <div class="sound-text">Volume</div>
            <div><input type="text" id="sound-volume-${id}" data-sound-id="${id}" data-name="volume" value="${sound_object.volume}" data-detail="{{音量設定}}" autocomplete="off" tabindex="-1"></div>
        
            <div class="sound-text">Loop<br>Count</div>
            <div><input type="text" id="sound-loop-count-${id}" data-sound-id="${id}" data-name="loop-count" value="${sound_object.loopCount}" data-detail="{{ループ回数}}" autocomplete="off" tabindex="-1"></div>
        </div>
    </div>
</div>
`;
};