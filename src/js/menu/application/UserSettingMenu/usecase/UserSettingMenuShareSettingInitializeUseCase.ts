import { $USER_SHARE_SETTING_ID } from "@/config/UserSettingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as userSettingMenuShareSettingMouseDownEventUseCase } from "./UserSettingMenuShareSettingMouseDownEventUseCase";

/**
 * @description 書き出しフォーマットの初期起動ユースケース
 *              Initial startup use case for export format
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($USER_SHARE_SETTING_ID) as HTMLSelectElement;

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN,
        userSettingMenuShareSettingMouseDownEventUseCase
    );
};