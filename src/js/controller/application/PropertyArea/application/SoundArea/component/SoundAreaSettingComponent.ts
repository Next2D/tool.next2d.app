import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";

/**
 * @description サウンドエリアの個別設定のElementをstringで返却
 *              Returns the Element of individual settings in the sound area as a string
 *
 * @param  {number} index
 * @param  {string} sound_name
 * @param  {object} sound_object
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    index: number,
    sound_name: string,
    sound_object: SoundObjectImpl
): string => {
    return `
<div data-index="${index}" class="sound-border">
    <div class="sound-title">
      <span data-index="${index}">${sound_name}</span>
      <i class="trash" data-index="${index}" data-detail="{{サウンドを削除}}"></i>
    </div>

    <div class="sound-container">
        <div class="sound-setting-container">
            <div class="sound-text">Volume</div>
            <div><input type="text" data-index="${index}" class="volume" value="${sound_object.volume}" data-detail="{{音量設定}}" autocomplete="off" tabindex="-1"></div>
        
            <div class="sound-text">Loop<br>Count</div>
            <div><input type="text" data-index="${index}" class="loop-count" value="${sound_object.loopCount}" data-detail="{{ループ回数}}" autocomplete="off" tabindex="-1"></div>
        </div>
    </div>
</div>
`;
};