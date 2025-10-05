import { EventType } from "@/tool/domain/event/EventType";
import { execute as colorSettingInputPointerOverEventService } from "../service/ColorSettingInputPointerOverEventService";
import { execute as colorSettingInputPointerOutEventService } from "../service/ColorSettingInputPointerOutEventService";
import { execute as colorSettingAlphaMultiplierPointerDownUseCase } from "./ColorSettingAlphaMultiplierPointerDownUseCase";
import { execute as colorSettingAlphaMultiplierFocusInEventService } from "../service/ColorSettingAlphaMultiplierFocusInEventService";
import { execute as colorSettingAlphaMultiplierFocusOutEventUseCase } from "./ColorSettingAlphaMultiplierFocusOutEventUseCase";
import { execute as colorSettingInputKeyPressEventService } from "../service/ColorSettingInputKeyPressEventService";
import { execute as colorSettingAlphaOffsetPointerDownUseCase } from "./ColorSettingAlphaOffsetPointerDownUseCase";
import {
    $COLOR_ALPHA_MULTIPLIER_ID,
    $COLOR_ALPHA_OFFSET_ID
} from "@/config/ColorSettingConfig";

/**
 * @description カラー設定の初期化イベント登録ユースケース
 *              Color setting initialization event registration use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const alphaMultiplierElement: HTMLInputElement | null = document
        .getElementById($COLOR_ALPHA_MULTIPLIER_ID) as HTMLInputElement;

    if (alphaMultiplierElement) {
        alphaMultiplierElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        alphaMultiplierElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        alphaMultiplierElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingAlphaMultiplierPointerDownUseCase,
            { "passive": false }
        );
        alphaMultiplierElement.addEventListener("focusin",
            colorSettingAlphaMultiplierFocusInEventService
        );
        alphaMultiplierElement.addEventListener("focusout",
            colorSettingAlphaMultiplierFocusOutEventUseCase
        );
        alphaMultiplierElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }
    const alphaOffsetElement: HTMLInputElement | null = document
        .getElementById($COLOR_ALPHA_OFFSET_ID) as HTMLInputElement;

    if (alphaOffsetElement) {
        alphaOffsetElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        alphaOffsetElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        alphaOffsetElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingAlphaOffsetPointerDownUseCase,
            { "passive": false }
        );
        alphaOffsetElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }
};