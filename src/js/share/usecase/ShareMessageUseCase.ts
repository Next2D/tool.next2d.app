import { execute as shareInitializeCommandUseCase } from "./ShareInitializeCommandUseCase";
import { execute as shareLoadCommandUseCase } from "./ShareLoadCommandUseCase";
import { execute as shareReceiveUseCase } from "./ShareReceiveUseCase";
import { $isLoadedInitializeData, $isSocketOwner } from "../ShareUtil";

/**
 * @description Socketのメッセージ管理関数
 *              Message management functions of the Socket
 *
 * @param  {MessageEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MessageEvent): void =>
{
    const message = JSON.parse(event.data);
    switch (message.command) {

        case "receive":
            shareReceiveUseCase(message);
            break;

        case "initialize":
            // オーナーでなれければ終了
            if (!$isSocketOwner()) {
                return ;
            }

            shareInitializeCommandUseCase(message.connectionId);
            break;

        case "load":
            // オーナーなら何もしないで終了
            if ($isSocketOwner()) {
                return ;
            }

            // 初回読み込みが完了していれば終了
            if ($isLoadedInitializeData()) {
                return ;
            }

            shareLoadCommandUseCase(message);
            break;

        default:
            break;

    }
};