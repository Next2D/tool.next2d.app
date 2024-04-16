import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaSoundAreaAddSettingAreaService } from "../service/PropertyAreaSoundAreaAddSettingAreaService";

/**
 * @description 現在のフレームに設定されているサウンドの設定表示を再構成
 *              Reconstruct the sound settings displayed on the current frame
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document.getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);
    if (!element) {
        return ;
    }

    // 設定エリアを初期化
    while (element.firstElementChild) {
        element.firstElementChild.remove();
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const sounds = movieClip.getSound(movieClip.currentFrame);
    if (!sounds) {
        return;
    }

    for (let idx = 0; idx < sounds.length; idx++) {
        const soundObject = sounds[idx];
        if (!soundObject) {
            continue;
        }

        const sound = workSpace.getLibrary(soundObject.libraryId);
        if (!sound) {
            continue;
        }

        // 設定エリアを追加
        propertyAreaSoundAreaAddSettingAreaService(
            idx, sound.name, soundObject
        );
    }
};