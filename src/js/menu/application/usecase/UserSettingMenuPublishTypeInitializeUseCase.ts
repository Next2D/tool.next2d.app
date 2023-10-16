import { $USER_PUBLISH_TYPE_SETTING_ID } from "../../../config/UserSettingConfig";
import { EventType } from "../../../tool/domain/event/EventType";
import { execute as userSettingMenuPublishTypeOptionSelectedService } from "../service/UserSettingMenuPublishTypeOptionSelectedService";
import { execute as userSettingMenuPublishTypeChangeEventService } from "../service/UserSettingMenuPublishTypeChangeEventService";

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
        .getElementById($USER_PUBLISH_TYPE_SETTING_ID) as HTMLSelectElement;

    if (element) {

        // ユーザー個別のデータから表示を切り替える
        userSettingMenuPublishTypeOptionSelectedService(element);

        element
            .addEventListener(EventType.CHANGE, (event: Event): void =>
            {
                userSettingMenuPublishTypeChangeEventService(event);
            });
    }
};