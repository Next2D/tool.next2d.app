import type { MenuImpl } from "@/interface/MenuImpl";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import type { UserSettingObjectImpl } from "@/interface/UserSettingObjectImpl";
import type { DetailModal } from "@/menu/domain/model/DetailModal";
import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import { $replace } from "@/language/application/LanguageUtil";
import { execute as userSettingObjectGetService } from "@/user/application/Setting/service/UserSettingObjectGetService";
import { execute as detailModalHideService } from "../service/DetailModalHideService";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $getViewMapping } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";

/**
 * @description ショートカットメニューのフェードインのユースケース
 *              Shortcut menu fade-in use case
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const userSetting: UserSettingObjectImpl = userSettingObjectGetService();
    if (!userSetting.modal) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($DETAIL_MODAL_NAME);

    if (!element || element.classList.contains("fadeIn")) {
        return ;
    }

    const target: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!target || !target.dataset.detail) {
        return ;
    }

    let value: string = $replace(
        target.dataset.detail as string
    );

    const shortcutKey: string | undefined = target.dataset.shortcutKey;
    if (shortcutKey) {

        let shortcutText: string | undefined = target.dataset.shortcutText;

        const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

        if (viewMapping.size && viewMapping.has(shortcutKey)) {
            const shortcutObject: ShortcutViewObjectImpl | undefined = viewMapping.get(shortcutKey) as ShortcutViewObjectImpl;
            if (shortcutObject) {
                shortcutText = shortcutObject.text;
            }
        }

        value += ` (${shortcutText})`;
    }

    if (element.textContent !== value) {
        element.textContent = value;
    }

    const menu: MenuImpl<DetailModal> | null = $getMenu($DETAIL_MODAL_NAME);
    if (!menu) {
        return ;
    }

    // 表示領域に収まるようx座標を調整
    switch (true) {

        case element.clientWidth + event.pageX - 20 > window.innerWidth:
            menu.offsetLeft = event.pageX - (element.clientWidth + event.pageX + 10 - window.innerWidth);
            break;

        case 0 > event.pageX - 20:
            menu.offsetLeft = 10;
            break;

        default:
            menu.offsetLeft = event.pageX - 20;
            break;

    }

    // 表示領域に収まるようy座標を調整
    switch (true) {

        case element.clientHeight + event.pageY + 20 > window.innerHeight:
            menu.offsetTop = event.pageY - element.clientHeight - 20;
            break;

        default:
            menu.offsetTop = event.pageY + 20;
            break;

    }

    // 1.5秒で自動的に消えるようタイマーをセット
    const timerId = setTimeout((): void =>
    {
        detailModalHideService();
    }, 1500);

    element.dataset.timerId = `${timerId}`;

    detailModalHideService();
    menu.show();
};