import { $setSocketOwner } from "../ShareUtil";
import { execute as shareConnectUseCase } from "./ShareConnectUseCase";

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