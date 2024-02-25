// @ts-ignore
const PRE_SIGNER_URL = import.meta.env.VITE_PRE_SIGNER_URL;
// @ts-ignore
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

/**
 * @description WSSの証明書付きURLを発行
 *              Issued URL with WSS certificate
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (room_id: string): Promise<any> =>
{
    return fetch(`${PRE_SIGNER_URL}?url=${SOCKET_URL}&roomId=${room_id}&service=execute-api`)
        .then((response: Response): Promise<any> =>
        {
            return response.json();
        });
};