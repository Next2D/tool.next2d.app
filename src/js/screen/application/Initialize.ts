import { execute as screenTabRegisterAddEventUseCase } from "../application/ScreenTab/usecase/ScreenTabRegisterAddEventUseCase";
import { execute as screenAreaInitializeRegisterEventUseCase } from "./ScreenArea/usecase/ScreenAreaInitializeRegisterEventUseCase";

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
    return new Promise((resolve): void =>
    {
        // タブ追加の初期起動ユースケース
        screenTabRegisterAddEventUseCase();

        // スクリーンエリアのマウスダウンイベントを登録
        screenAreaInitializeRegisterEventUseCase();

        return resolve();
    });
};