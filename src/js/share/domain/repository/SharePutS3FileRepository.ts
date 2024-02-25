/**
 * @description S3にファイルをアップロードする
 *              Upload files to S3
 *
 * @param  {string} url
 * @param  {string} binary
 * @return {object}
 * @method
 * @public
 */
export const execute = async (url: string, binary: string): Promise<any> =>
{
    await fetch(url, {
        "method": "PUT",
        "body": binary,
        "headers": {
            "Content-Type": "binary/octet-stream"
        }
    });
};