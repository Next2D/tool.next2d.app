import { EventType } from "@/tool/domain/event/EventType";
import { execute as scaleFrameMouseDownEventUseCase } from "./ScaleFrameMouseDownEventUseCase";
import { execute as scaleFrameMouseOverEventService } from "../service/ScaleFrameMouseOverEventService";
import { execute as scaleFrameMouseOutEventService } from "../service/ScaleFrameMouseOutEventService";
import { execute as scaleFrameFocusInEventService } from "../service/ScaleFrameFocusInEventService";
import { execute as scaleFrameFocusOutEventUseCase } from "./ScaleFrameFocusOutEventUseCase";
import { execute as scaleFrameKeyPressEventService } from "../service/ScaleFrameKeyPressEventService";

import { $TIMELINE_SCROLL_ID } from "@/config/TimelineConfig";

/**
 * @description フレームのスケール設定の初期化イベント登録
 *              Frame scale setting initialization event registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // フレームのスケール設定のinput element
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCROLL_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_OVER,
        scaleFrameMouseOverEventService
    );
    element.addEventListener(EventType.POINTER_OUT,
        scaleFrameMouseOutEventService
    );
    element.addEventListener(EventType.POINTER_DOWN,
        scaleFrameMouseDownEventUseCase
    );
    element.addEventListener("focusin",
        scaleFrameFocusInEventService
    );
    element.addEventListener("focusout",
        scaleFrameFocusOutEventUseCase
    );
    element.addEventListener("keypress",
        scaleFrameKeyPressEventService
    );
};