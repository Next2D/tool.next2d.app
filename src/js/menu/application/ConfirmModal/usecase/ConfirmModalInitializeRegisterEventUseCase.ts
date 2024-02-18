import { execute as confirmModalAllOverWritingUseCase } from "./ConfirmModalAllOverWritingUseCase";
import { execute as confirmModalOverWritingUseCase } from "./ConfirmModalOverWritingUseCase";
import { execute as confirmModalAllCancelUseCase } from "./ConfirmModalAllCancelUseCase";
import { execute as confirmModalCancelUseCase } from "./ConfirmModalCancelUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $CONFIRM_MODAL_ALL_CANCEL_ID,
    $CONFIRM_MODAL_ALL_OVERWRITING_ID,
    $CONFIRM_MODAL_CANCEL_ID,
    $CONFIRM_MODAL_OVERWRITING_ID
} from "@/config/ConfirmModalConfig";

/**
 * @description 確認モーダルのイベント登録処理
 *              Event registration process for confirmation modal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 全て上書き
    const allOverWritingElement: HTMLElement | null = document
        .getElementById($CONFIRM_MODAL_ALL_OVERWRITING_ID);

    if (allOverWritingElement) {
        allOverWritingElement.addEventListener(EventType.MOUSE_DOWN,
            confirmModalAllOverWritingUseCase
        );
    }

    const allCancelElement: HTMLElement | null = document
        .getElementById($CONFIRM_MODAL_ALL_CANCEL_ID);

    if (allCancelElement) {
        allCancelElement.addEventListener(EventType.MOUSE_DOWN,
            confirmModalAllCancelUseCase
        );
    }

    const overWritingElement: HTMLElement | null = document
        .getElementById($CONFIRM_MODAL_OVERWRITING_ID);

    if (overWritingElement) {
        overWritingElement.addEventListener(EventType.MOUSE_DOWN,
            confirmModalOverWritingUseCase
        );
    }

    const cancelElement: HTMLElement | null = document
        .getElementById($CONFIRM_MODAL_CANCEL_ID);

    if (cancelElement) {
        cancelElement.addEventListener(EventType.MOUSE_DOWN,
            confirmModalCancelUseCase
        );
    }
};