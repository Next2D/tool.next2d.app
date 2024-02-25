// @ts-ignore
const S3_SIGNER_URL = import.meta.env.VITE_S3_SIGNER_URL;

/**
 * @description S3の証明書付きURLを発行
 *              Issued URL with WSS certificate
 *
 * @param  {string} file_id
 * @param  {string} mode
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (file_id: string, mode: "get" | "put"): Promise<string> =>
{
    const roomId = location.hash.replace("#", "");
    const response = await fetch(
        `${S3_SIGNER_URL}?roomId=${roomId}&fileId=${file_id}&mode=${mode}`
    );
    const json = await response.json();
    return json.url;
};