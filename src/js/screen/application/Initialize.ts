import { execute as screenTabRegisterAddEventUseCase } from "../application/ScreenTab/usecase/ScreenTabRegisterAddEventUseCase";

/**
 * @description スクリーンエリアの初期起動関数
 *              Initial startup function for screen area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((resolve) =>
    {
        // タブ追加の初期起動ユースケース
        screenTabRegisterAddEventUseCase();

        return resolve();
    });
};