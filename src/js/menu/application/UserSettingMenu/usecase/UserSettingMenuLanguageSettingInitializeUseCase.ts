import { $USER_LANGUAGE_SETTING_ID } from "@/config/UserSettingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as settingMenuLanguageSettingChangeEventUseCase } from "./UserSettingMenuLanguageSettingChangeEventUseCase";
import { execute as userSettingMenuLanguageSettingOptionSelectedService } from "../service/UserSettingMenuLanguageSettingOptionSelectedService";

/**
 * @description 言語設定の初期起動ユースケース
 *              Initial startup use case for language settings
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($USER_LANGUAGE_SETTING_ID) as HTMLSelectElement;

    if (element) {

        // ユーザー個別のデータから表示を切り替える
        userSettingMenuLanguageSettingOptionSelectedService(element);

        element
            .addEventListener(EventType.CHANGE,
                settingMenuLanguageSettingChangeEventUseCase
            );
    }
};