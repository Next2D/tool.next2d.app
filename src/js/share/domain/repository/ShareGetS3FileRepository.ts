/**
 * @description S3のファイルをダウンロード
 *              Download S3 files
 *
 * @param  {string} url
 * @return {object}
 * @method
 * @public
 */
export const execute = async (url: string): Promise<string> =>
{
    const response = await fetch(url);
    return response.text();
};