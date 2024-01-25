/**
 * @description WebSocketオブジェクト
 *              WebSocket Objects
 *
 * @private
 */
let $webSocket: WebSocket | null = null;

/**
 * @description WebSocketを利用しているか判定
 *              Determine if WebSocket is used
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $useSocket = (): boolean =>
{
    return $webSocket !== null;
};

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
 * @param  {WebSocket | null} web_socket
 * @return {void}
 * @method
 * @public
 */
export const $setSocket = (web_socket: WebSocket | null): void =>
{
    if ($webSocket) {
        $webSocket.close();
    }
    $webSocket = web_socket;
};

/**
 * @description WebSocketの起動オーナー判定
 *              WebSocket startup owner determination
 *
 * @private
 */
let $webSocketOwner = false;

/**
 * @description WebSocketオブジェクトをセット
 *              Set WebSocket object
 *
 * @param  {WebSocket | null} web_socket
 * @return {void}
 * @method
 * @public
 */
export const $setSocketOwner = (owner: boolean): void =>
{
    $webSocketOwner = owner;
};

/**
 * @description WebSocketのオーナー状態を返却
 *              Return WebSocket owner status
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $isSocketOwner = (): boolean =>
{
    return $webSocketOwner;
};

/**
 * @description 共有時のユーザー名
 *              User name when sharing
 *
 * @type {string}
 * @private
 */
let $userName: string = "";

/**
 * @description 共有時のユーザー名を返却
 *              Returns the user name at the time of sharing
 *
 * @return {string}
 * @method
 * @public
 */
export const $getUserName = (): string =>
{
    return $userName;
};

/**
 * @description 共有時のユーザー名をセット
 *              Set user name when sharing
 *
 * @return {string}
 * @method
 * @public
 */
export const $setUserName = (name: string): void =>
{
    $userName = name;
};