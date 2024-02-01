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
    return $webSocket !== null || location.hash !== "";
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
 * @description 初回のデータ同期が完了しているか
 *              Is the initial data synchronization complete?
 *
 * @private
 */
let $loadedData = false;

/**
 * @description 初回のデータ同期完了をセット
 *              Set initial data synchronization completion
 *
 * @return {void}
 * @method
 * @public
 */
export const $loadedInitializeData = (): void =>
{
    $loadedData = true;
};

/**
 * @description 初回のデータ同期完了してるかを返却
 *              Returns whether data synchronization is completed for the first time.
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $isLoadedInitializeData = (): boolean =>
{
    return $loadedData;
};