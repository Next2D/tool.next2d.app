import { $USER_PUBLISH_LAYER_SETTING_ID } from "../../../config/UserSettingConfig";
import { EventType } from "../../../tool/domain/event/EventType";

/**
 * @description ユーザー設定メニューに配置された各Elementにイベント登録を行う
 *              Register events in each Element placed in the User Settings menu.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const layerElement: HTMLElement | null = document
        .getElementById($USER_PUBLISH_LAYER_SETTING_ID);

    if (layerElement) {
        layerElement
            .addEventListener(EventType.CHANGE, (event: Event): void =>
            {
                event.stopPropagation();
            });
    }
};