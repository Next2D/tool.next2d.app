import { EventType } from "@/tool/domain/event/EventType";
import { execute as colorSettingInputPointerOverEventService } from "../service/ColorSettingInputPointerOverEventService";
import { execute as colorSettingInputPointerOutEventService } from "../service/ColorSettingInputPointerOutEventService";
import { execute as colorSettingAlphaMultiplierPointerDownUseCase } from "./ColorSettingAlphaMultiplierPointerDownUseCase";
import { execute as colorSettingInputFocusInEventService } from "../service/ColorSettingInputFocusInEventService";
import { execute as colorSettingAlphaMultiplierFocusOutEventUseCase } from "./ColorSettingAlphaMultiplierFocusOutEventUseCase";
import { execute as colorSettingAlphaOffsetFocusOutEventUseCase } from "./ColorSettingAlphaOffsetFocusOutEventUseCase";
import { execute as colorSettingInputKeyPressEventService } from "../service/ColorSettingInputKeyPressEventService";
import { execute as colorSettingAlphaOffsetPointerDownUseCase } from "./ColorSettingAlphaOffsetPointerDownUseCase";
import { execute as colorSettingRedMultiplierPointerDownUseCase } from "./ColorSettingRedMultiplierPointerDownUseCase";
import { execute as colorSettingRedMultiplierFocusOutEventUseCase } from "./ColorSettingRedMultiplierFocusOutEventUseCase";
import { execute as colorSettingRedOffsetPointerDownUseCase } from "./ColorSettingRedOffsetPointerDownUseCase";
import { execute as colorSettingRedOffsetFocusOutEventUseCase } from "./ColorSettingRedOffsetFocusOutEventUseCase";
import { execute as colorSettingGreenMultiplierPointerDownUseCase } from "./ColorSettingGreenMultiplierPointerDownUseCase";
import { execute as colorSettingGreenMultiplierFocusOutEventUseCase } from "./ColorSettingGreenMultiplierFocusOutEventUseCase";
import { execute as colorSettingGreenOffsetPointerDownUseCase } from "./ColorSettingGreenOffsetPointerDownUseCase";
import { execute as colorSettingGreenOffsetFocusOutEventUseCase } from "./ColorSettingGreenOffsetFocusOutEventUseCase";
import {
    $COLOR_ALPHA_MULTIPLIER_ID,
    $COLOR_ALPHA_OFFSET_ID,
    $COLOR_RED_MULTIPLIER_ID,
    $COLOR_RED_OFFSET_ID,
    $COLOR_GREEN_MULTIPLIER_ID,
    $COLOR_GREEN_OFFSET_ID,
    $COLOR_BLUE_MULTIPLIER_ID,
    $COLOR_BLUE_OFFSET_ID
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
    const blueOffsetElement: HTMLInputElement | null = document
        .getElementById($COLOR_BLUE_OFFSET_ID) as HTMLInputElement;

    if (blueOffsetElement) {
        blueOffsetElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        blueOffsetElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        // blueOffsetElement.addEventListener(EventType.POINTER_DOWN,
        //     colorSettingGreenOffsetPointerDownUseCase,
        //     { "passive": false }
        // );
        blueOffsetElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        // blueOffsetElement.addEventListener("focusout",
        //     colorSettingGreenOffsetFocusOutEventUseCase
        // );
        blueOffsetElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

    const blueMultiplierElement: HTMLInputElement | null = document
        .getElementById($COLOR_BLUE_MULTIPLIER_ID) as HTMLInputElement;

    if (blueMultiplierElement) {
        blueMultiplierElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        blueMultiplierElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        // blueMultiplierElement.addEventListener(EventType.POINTER_DOWN,
        //     colorSettingGreenOffsetPointerDownUseCase,
        //     { "passive": false }
        // );
        blueMultiplierElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        // blueMultiplierElement.addEventListener("focusout",
        //     colorSettingGreenOffsetFocusOutEventUseCase
        // );
        blueMultiplierElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

    const greenOffsetElement: HTMLInputElement | null = document
        .getElementById($COLOR_GREEN_OFFSET_ID) as HTMLInputElement;

    if (greenOffsetElement) {
        greenOffsetElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        greenOffsetElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        greenOffsetElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingGreenOffsetPointerDownUseCase,
            { "passive": false }
        );
        greenOffsetElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        greenOffsetElement.addEventListener("focusout",
            colorSettingGreenOffsetFocusOutEventUseCase
        );
        greenOffsetElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

    const greenMultiplierElement: HTMLInputElement | null = document
        .getElementById($COLOR_GREEN_MULTIPLIER_ID) as HTMLInputElement;

    if (greenMultiplierElement) {
        greenMultiplierElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        greenMultiplierElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        greenMultiplierElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingGreenMultiplierPointerDownUseCase,
            { "passive": false }
        );
        greenMultiplierElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        greenMultiplierElement.addEventListener("focusout",
            colorSettingGreenMultiplierFocusOutEventUseCase
        );
        greenMultiplierElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

    const redOffsetElement: HTMLInputElement | null = document
        .getElementById($COLOR_RED_OFFSET_ID) as HTMLInputElement;

    if (redOffsetElement) {
        redOffsetElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        redOffsetElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        redOffsetElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingRedOffsetPointerDownUseCase,
            { "passive": false }
        );
        redOffsetElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        redOffsetElement.addEventListener("focusout",
            colorSettingRedOffsetFocusOutEventUseCase
        );
        redOffsetElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

    const redMultiplierElement: HTMLInputElement | null = document
        .getElementById($COLOR_RED_MULTIPLIER_ID) as HTMLInputElement;

    if (redMultiplierElement) {
        redMultiplierElement.addEventListener(EventType.POINTER_OVER,
            colorSettingInputPointerOverEventService
        );
        redMultiplierElement.addEventListener(EventType.POINTER_OUT,
            colorSettingInputPointerOutEventService
        );
        redMultiplierElement.addEventListener(EventType.POINTER_DOWN,
            colorSettingRedMultiplierPointerDownUseCase,
            { "passive": false }
        );
        redMultiplierElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        redMultiplierElement.addEventListener("focusout",
            colorSettingRedMultiplierFocusOutEventUseCase
        );
        redMultiplierElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }

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
            colorSettingInputFocusInEventService
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
        alphaOffsetElement.addEventListener("focusin",
            colorSettingInputFocusInEventService
        );
        alphaOffsetElement.addEventListener("focusout",
            colorSettingAlphaOffsetFocusOutEventUseCase
        );
        alphaOffsetElement.addEventListener("keypress",
            colorSettingInputKeyPressEventService
        );
    }
};