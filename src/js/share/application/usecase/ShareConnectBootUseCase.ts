import { $getMenu } from "@/menu/application/MenuUtil";
import { $setSocketOwner } from "../ShareUtil";
import { execute as shareConnectUseCase } from "./ShareConnectUseCase";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { BillingModal } from "@/menu/domain/model/BillingModal";

/**
 * @description WebSocketの機能を起動
 *              Activate WebSocket functionality
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if (!userAllFunctionStateService()) {
        const menu: MenuImpl<BillingModal> | null = $getMenu($BILLING_MODAL_NAME);
        if (menu) {
            menu.show();
        }
        return ;
    }

    // ユニークなIDを発番
    const roomId = crypto.randomUUID();

    // URLを更新
    history.pushState("", "",
        `${location.origin}/#${roomId}`
    );

    // オーナーとして登録
    $setSocketOwner(true);

    // WebSocketを起動
    shareConnectUseCase(roomId);
};