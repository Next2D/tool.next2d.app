import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import { $replace } from "@/language/application/LanguageUtil";
import { $getMenu } from "../../MenuUtil";
import { DetailModal } from "@/menu/domain/model/DetailModal";
import { MenuImpl } from "@/interface/MenuImpl";
import { execute as detailModalHideService } from "../service/DetailModalHideService";

/**
 * @description モーダルの個別表示のユースケース
 *              Use Cases for Individual Modal Display
 *
 * @param  {string} text
 * @param  {number} position_x
 * @param  {number} position_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    text: string,
    position_x: number,
    position_y: number
): void => {

    const element: HTMLElement | null = document
        .getElementById($DETAIL_MODAL_NAME);

    if (!element || element.classList.contains("fadeIn")) {
        return ;
    }

    const menu: MenuImpl<DetailModal> | null = $getMenu($DETAIL_MODAL_NAME);
    if (!menu) {
        return ;
    }

    // 座標を調整
    menu.offsetLeft = position_x;
    menu.offsetLeft = position_y;

    // 表示テキストを更新
    element.textContent = $replace(`{{${text}}}`)
        .replace("{{", "")
        .replace("}}", "");

    // 表示領域に収まるようx座標を調整
    switch (true) {

        case element.clientWidth + position_x - 20 > window.innerWidth:
            menu.offsetLeft = position_x - (element.clientWidth + position_x + 10 - window.innerWidth);
            break;

        case 0 > position_x - 20:
            menu.offsetLeft = 10;
            break;

        default:
            menu.offsetLeft = position_x - 20;
            break;

    }

    // 表示領域に収まるようy座標を調整
    switch (true) {

        case element.clientHeight + position_y + 20 > window.innerHeight:
            menu.offsetTop = position_y - element.clientHeight - 20;
            break;

        default:
            menu.offsetTop = position_y + 20;
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