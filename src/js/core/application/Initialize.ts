/**
 * @description コア機能の初期起動関数
 *              Initial startup functions for core functions
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