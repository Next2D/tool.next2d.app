import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import type { IMenu } from "@/interface/IMenu";
import type { DetailModal } from "@/menu/domain/model/DetailModal";
import { $getMenu } from "@/menu/application/MenuUtil";

/**
 * @description 説明モーダルを非表示にする
 *              Hide description modal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 進行状況メニューを非表示に
    const menu: IMenu<DetailModal> | null = $getMenu($DETAIL_MODAL_NAME);
    if (!menu) {
        return ;
    }
    menu.hide();
};