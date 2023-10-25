/**
 * @description ユーザー固有情報の初期起動関数
 *              Initial startup function for user-specific information
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    // 初期起動時のユースケース
    return new Promise((resolve): void =>
    {
        return resolve();
    });
};