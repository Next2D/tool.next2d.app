import { $TOOL_USER_SETTING_ID } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as userSettingToolPointerDownEventUseCase } from "./UserSettingToolPointerDownEventUseCase";

/**
 * @description ユーザー設定ツールの初期起動時のユースケース
 *              Use case for initial startup of the user configuration tool
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TOOL_USER_SETTING_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_DOWN,
        userSettingToolPointerDownEventUseCase
    );
};