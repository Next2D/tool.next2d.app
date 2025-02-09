import { $SCREEN_SCALE_ID } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as zoomToolMouseOverEventService } from "../service/ZoomToolMouseOverEventService";
import { execute as zoomToolMouseOutEventService } from "../service/ZoomToolMouseOutEventService";
import { execute as zoomToolFocusInEventService } from "../service/ZoomToolFocusInEventService";
import { execute as zoomToolKeyPressEventService } from "../service/ZoomToolKeyPressEventService";
import { execute as zoomToolMouseDownEventUseCase } from "./ZoomToolMouseDownEventUseCase";
import { execute as zoomToolFocusOutEventUseCase } from "./ZoomToolFocusOutEventUseCase";

/**
 * @description スームアップツールの初期起動ユースケース
 *              Zoom up tool initial startup use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document
        .getElementById($SCREEN_SCALE_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_OVER,
        zoomToolMouseOverEventService
    );
    element.addEventListener(EventType.POINTER_OUT,
        zoomToolMouseOutEventService
    );
    element.addEventListener(EventType.POINTER_DOWN,
        zoomToolMouseDownEventUseCase
    );
    element.addEventListener("focusin",
        zoomToolFocusInEventService
    );
    element.addEventListener("focusout",
        zoomToolFocusOutEventUseCase
    );
    element.addEventListener("keypress",
        zoomToolKeyPressEventService
    );
};