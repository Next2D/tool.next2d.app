import { $USER_PUBLISH_LAYER_SETTING_ID } from "@/config/UserSettingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as userSettingMenuLayerSettingChangeEventService } from "../service/UserSettingMenuLayerSettingChangeEventService";
import { execute as userSettingMenuLayerSettingOptionSelectedService } from "../service/UserSettingMenuLayerSettingOptionSelectedService";

/**
 * @description 非表示レイヤーの初期起動ユースケース
 *              Initial activation use case for hidden layers
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($USER_PUBLISH_LAYER_SETTING_ID) as HTMLSelectElement;

    if (element) {

        // ユーザー個別のデータから表示を切り替える
        userSettingMenuLayerSettingOptionSelectedService(element);

        element
            .addEventListener(EventType.CHANGE, (event: Event): void =>
            {
                userSettingMenuLayerSettingChangeEventService(event);
            });
    }
};