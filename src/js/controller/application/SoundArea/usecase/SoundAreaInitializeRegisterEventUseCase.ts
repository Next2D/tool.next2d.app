import { $SOUND_AREA_ADD_SOUND_ID } from "@/config/PropertyConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaSoundAddMouseDownEventUseCase } from "./SoundAreaSoundAddMouseDownEventUseCase";

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
    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_ADD_SOUND_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        soundAreaSoundAddMouseDownEventUseCase
    );
};