/**
 * @description WebSocketオブジェクト
 *              WebSocket Objects
 *
 * @private
 */
let $webSocket: WebSocket | null = null;

/**
 * @description WebSocketオブジェクトを返す
 *              Returns a WebSocket object
 *
 * @return {WebSocket| null}
 * @method
 * @public
 */
export const $getSocket = (): WebSocket | null =>
{
    return $webSocket;
};

/**
 * @description WebSocketオブジェクトをセット
 *              Set WebSocket object
 *
 * @param  {WebSocket} web_socket
 * @return {void}
 * @method
 * @public
 */
export const $setSocket = (web_socket: WebSocket): void =>
{
    $webSocket = web_socket;
};