import { $USER_SHORTCUT_SETTING_ID } from "../../../config/UserSettingConfig";
import { EventType } from "../../../tool/domain/event/EventType";
import { execute as userSettingMenuShortcutSettingMouseDownEventUseCase } from "../usecase/UserSettingMenuShortcutSettingMouseDownEventUseCase";

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
        .getElementById($USER_SHORTCUT_SETTING_ID) as HTMLSelectElement;

    if (element) {

        element
            .addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
            {
                userSettingMenuShortcutSettingMouseDownEventUseCase(event);
            });
    }
};