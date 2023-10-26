import { $DETAIL_MODAL_NAME } from "../../../../config/MenuConfig";
import type { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";
import { execute as userSettingObjectGetService } from "../../../../user/application/Setting/service/UserSettingObjectGetService";

/**
 * @description ショートカットメニューのフェードアウトのユースケース
 *              Shortcut menu fade-out use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const userSetting: UserSettingObjectImpl = userSettingObjectGetService();
    if (!userSetting.modal) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($DETAIL_MODAL_NAME);

    if (!element || element.classList.contains("fadeOut")) {
        return ;
    }

    // fadeinで設定されたtimerをキャンセル
    const timerId: number = parseFloat(element.dataset.timerId as NonNullable<string>);
    clearTimeout(timerId);

    // クラスを書き換え
    element.setAttribute("class", "fadeOut");
};