import { execute as objectSettingFocusInEventUseCase } from "./ObjectSettingFocusInEventUseCase";
import { execute as objectSettingKeyPressEventService } from "../service/ObjectSettingKeyPressEventService";
import { execute as objectSettingNameFocusOutEventUseCase } from "./ObjectSettingNameFocusOutEventUseCase";
import { execute as objectSettingSymbolFocusOutEventUseCase } from "./ObjectSettingSymbolFocusOutEventUseCase";
import { execute as objectSettingPointerDownUseCase } from "./ObjectSettingPointerDownUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $OBJECT_SETTING_NAME_ID,
    $OBJECT_SETTING_SYMBOL_ID
} from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定のイベントを登録
 *              Register object setting events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const nameElement: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_NAME_ID) as HTMLInputElement;

    // 名前のinputにイベントを登録
    if (nameElement) {
        nameElement.addEventListener(EventType.POINTER_DOWN, objectSettingPointerDownUseCase);
        nameElement.addEventListener("focusin", objectSettingFocusInEventUseCase);
        nameElement.addEventListener("focusout", objectSettingNameFocusOutEventUseCase);
        nameElement.addEventListener("keypress", objectSettingKeyPressEventService);
    }

    const symbolElement: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_SYMBOL_ID) as HTMLInputElement;

    // シンボルのinputにイベントを登録
    if (symbolElement) {
        symbolElement.addEventListener(EventType.POINTER_DOWN, objectSettingPointerDownUseCase);
        symbolElement.addEventListener("focusin", objectSettingFocusInEventUseCase);
        symbolElement.addEventListener("focusout", objectSettingSymbolFocusOutEventUseCase);
        symbolElement.addEventListener("keypress", objectSettingKeyPressEventService);
    }
};