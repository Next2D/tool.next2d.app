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
    let roomId: string = location.hash;
    if (!roomId) {
        return ;
    }

    roomId = roomId.replace("#", "");
    console.log(roomId);
};