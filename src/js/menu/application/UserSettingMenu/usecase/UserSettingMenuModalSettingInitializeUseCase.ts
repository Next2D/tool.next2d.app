import { $USER_PUBLISH_MODAL_SETTING_ID } from "../../../../config/UserSettingConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as userSettingMenuModalSettingChangeEventService } from "../service/UserSettingMenuModalSettingChangeEventService";
import { execute as userSettingMenuModalSettingOptionSelectedService } from "../service/UserSettingMenuModalSettingOptionSelectedService";

/**
 * @description モーダル表示の初期起動ユースケース
 *              Initial startup use case for modal display
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($USER_PUBLISH_MODAL_SETTING_ID) as HTMLSelectElement;

    if (element) {

        // ユーザー個別のデータから表示を切り替える
        userSettingMenuModalSettingOptionSelectedService(element);

        element
            .addEventListener(EventType.CHANGE, (event: Event): void =>
            {
                userSettingMenuModalSettingChangeEventService(event);
            });
    }
};