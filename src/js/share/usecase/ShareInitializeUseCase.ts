import { execute as shareConnectUseCase } from "./ShareConnectUseCase";

/**
 * @description WebSocketの初期起動時のユースケース
 *              Use cases for initial WebSocket startup
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const roomId: string = location.hash;
    if (!roomId) {
        return ;
    }

    shareConnectUseCase(roomId.replace("#", ""));
};