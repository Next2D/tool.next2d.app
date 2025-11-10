import { EventType } from "@/tool/domain/event/EventType";
import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";
import { execute as convertMovieClipModalChildPointerDownEventUseCase } from "./ConvertMovieClipModalChildPointerDownEventUseCase";
import { execute as convertMovieClipModalInputFocusInEventService } from "../service/ConvertMovieClipModalInputFocusInEventService";
import { execute as convertMovieClipModalInputFocusOutEventUseCase } from "../service/ConvertMovieClipModalInputFocusOutEventUseCase";
import { execute as convertMovieClipModalInputKeyPressEventService } from "../service/ConvertMovieClipModalInputKeyPressEventService";
import {
    $CONVERT_CANCEL_BUTTON_ID,
    $CONVERT_MOVIE_CLIP_INPUT_ID
} from "@/config/ConvertMovieClipConfig";

/**
 * @description ConvertMovieClipModalの初期化時にイベントを登録する
 *              Register events when initializing ConvertMovieClipModal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 子要素のPointerDownイベントを登録する
    const element = document.getElementById($CONVERT_MOVIE_CLIP_MODAL_NAME);
    if (element) {
        const elements = element.querySelectorAll(".convert-movie-clip-box-child");
        for (let idx = 0; idx < elements.length; idx++) {

            const node = elements[idx] as HTMLElement;
            if (!node) {
                continue;
            }

            node.addEventListener(EventType.POINTER_DOWN,
                convertMovieClipModalChildPointerDownEventUseCase
            );
        }
    }

    // キャンセルボタンのイベントを登録する
    const cancelButton: HTMLElement | null = document
        .getElementById($CONVERT_CANCEL_BUTTON_ID);
    if (cancelButton) {
        cancelButton.addEventListener(EventType.POINTER_DOWN,
            convertMovieClipModalHideUseCase
        );
    }

    // 入力フィールドの初期値を設定する
    const inputField: HTMLInputElement | null = document
        .getElementById($CONVERT_MOVIE_CLIP_INPUT_ID) as HTMLInputElement;
    if (inputField) {
        inputField.addEventListener("focusin",
            convertMovieClipModalInputFocusInEventService
        );
        inputField.addEventListener("focusout",
            convertMovieClipModalInputFocusOutEventUseCase
        );
        inputField.addEventListener("keypress",
            convertMovieClipModalInputKeyPressEventService
        );
    }
};