import { $DETAIL_MODAL_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import { $getMenu } from "../../../../menu/application/MenuUtil";
import type { DetailModal } from "../../../../menu/domain/model/DetailModal";

/**
 * @description 指定Elementの説明文章をモダール表示するようイベントを登録
 *              Register an event to display the description text of the specified Element as a modality.
 *
 * @params {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const detailModal: MenuImpl<DetailModal> | null = $getMenu($DETAIL_MODAL_NAME);
    if (!detailModal) {
        return ;
    }
    detailModal.registerFadeEvent(element);
};