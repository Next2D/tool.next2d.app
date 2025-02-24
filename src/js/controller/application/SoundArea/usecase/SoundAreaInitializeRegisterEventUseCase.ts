import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaSoundAddMouseDownEventUseCase } from "./SoundAreaSoundAddMouseDownEventUseCase";
import {
    $SOUND_AREA_ADD_SOUND_ID,
    $SOUND_AREA_SELECT_ID
} from "@/config/SoundSettingConfig";

/**
 * @description サウンドエリア初期化イベント登録ユースケース
 *              Sound area initialization event registration use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const soundAddElement: HTMLElement | null = document
        .getElementById($SOUND_AREA_ADD_SOUND_ID);

    // マウスダウンイベントを登録
    if (soundAddElement) {
        soundAddElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaSoundAddMouseDownEventUseCase
        );
    }

    const selectElement: HTMLElement | null = document
        .getElementById($SOUND_AREA_SELECT_ID);

    if (selectElement) {
        selectElement.addEventListener(EventType.POINTER_DOWN, (event: PointerEvent): void =>
        {
            // イベントの伝播を止める
            event.stopPropagation();
        });
    }
};