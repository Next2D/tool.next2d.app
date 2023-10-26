import { $DETAIL_MODAL_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { DetailModal } from "../../../domain/model/DetailModal";
import { $getMenu } from "../../MenuUtil";

/**
 * @description 指定のElement内にイベントを登録する
 *              Register an event within a specified Element
 *
 * @params {HTMLElement | Document} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement | Document): void =>
{
    // 初期のDOMを対象に説明モーダルのイベントをセット
    const detailModal: MenuImpl<DetailModal> | null = $getMenu($DETAIL_MODAL_NAME);
    if (!detailModal) {
        return ;
    }

    detailModal.registerFadeEvent(element);
};