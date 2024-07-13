import { $TOOL_STROKE_SIZE_ID } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as userStrokeSizeGetService } from "@/user/application/Tool/service/UserStrokeSizeGetService";
import { strokeSize } from "@/tool/domain/model/StrokeSize";
import { execute as strokeSizeFocusInEventService } from "../service/StrokeSizeFocusInEventService";
import { execute as strokeSizeKeyPressEventService } from "../service/StrokeSizeKeyPressEventService";
import { execute as strokeSizeMouseOverEventService } from "../service/StrokeSizeMouseOverEventService";
import { execute as strokeSizeMouseOutEventService } from "../service/StrokeSizeMouseOutEventService";
import { execute as strokeSizeMouseDownEventUseCase } from "./StrokeSizeMouseDownEventUseCase";
import { execute as strokeSizeFocusOutEventUseCase } from "./StrokeSizeFocusOutEventUseCase";

/**
 * @description 塗りInputの初期起動ユースケース
 *              Initial startup use case of Fill Input
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document
        .getElementById($TOOL_STROKE_SIZE_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // ユーザーの塗りのカラー情報を取得
    strokeSize.value = userStrokeSizeGetService();
    element.value = `${strokeSize.value}`;

    // イベントを登録
    element.addEventListener("focusin",
        strokeSizeFocusInEventService
    );

    element.addEventListener("keypress",
        strokeSizeKeyPressEventService
    );

    element.addEventListener("focusout",
        strokeSizeFocusOutEventUseCase
    );

    element.addEventListener(EventType.MOUSE_OVER,
        strokeSizeMouseOverEventService
    );

    element.addEventListener(EventType.MOUSE_OUT,
        strokeSizeMouseOutEventService
    );

    element.addEventListener(EventType.MOUSE_DOWN,
        strokeSizeMouseDownEventUseCase
    );
};