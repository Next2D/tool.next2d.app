import { execute as shareInitializeCommandUseCase } from "./ShareInitializeCommandUseCase";
import { execute as shareLoadCommandUseCase } from "./ShareLoadCommandUseCase";
import { execute as shareReceiveUseCase } from "./ShareReceiveUseCase";
import { $isSocketOwner } from "../ShareUtil";

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

        case "initialize":
            // オーナーでなれければ終了
            if (!$isSocketOwner()) {
                return;
            }

            shareInitializeCommandUseCase(message.FROM);
            break;

        case "load":
            // オーナーなら何もしないで終了
            if ($isSocketOwner()) {
                return;
            }

            shareLoadCommandUseCase(message);
            break;

        case "receive":
            shareReceiveUseCase(message);
            break;

        default:
            break;

    }
};