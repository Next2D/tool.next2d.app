// @ts-ignore
const WSS_PRE_SIGNER_URL = import.meta.env.VITE_WSS_PRE_SIGNER_URL;
// @ts-ignore
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

/**
 * @description WSSの証明書付きURLを発行
 *              Issued URL with WSS certificate
 *
 * @param  {string} room_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (room_id: string): Promise<any> =>
{
    const response = await fetch(
        `${WSS_PRE_SIGNER_URL}?url=${SOCKET_URL}&roomId=${room_id}`
    );
    return await response.json();
};