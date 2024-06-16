import { execute as screenTabRegisterAddEventUseCase } from "../application/ScreenTab/usecase/ScreenTabRegisterAddEventUseCase";
import { execute as screenAreaInitializeRegisterEventUseCase } from "./ScreenArea/usecase/ScreenAreaInitializeRegisterEventUseCase";
import { execute as screenScrollInitializeRegisterEventUseCase } from "./ScreenScroll/usecase/ScreenScrollInitializeRegisterEventUseCase";

/**
 * @description スクリーンエリアの初期起動関数
 *              Initial startup function for screen area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // タブ追加の初期起動ユースケース
    screenTabRegisterAddEventUseCase();

    // スクリーンエリアのイベントを登録
    screenAreaInitializeRegisterEventUseCase();

    // スクリーンエリアのスクロールバーのイベントを登録
    screenScrollInitializeRegisterEventUseCase();
};