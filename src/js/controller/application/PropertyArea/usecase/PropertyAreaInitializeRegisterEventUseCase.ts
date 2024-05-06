import { execute as propertyAreaRegisterTitleEventUseCase } from "./PropertyAreaRegisterTitleEventUseCase";
import { execute as propertyAreaRegisterMoveEventUseCase } from "./PropertyAreaRegisterMoveEventUseCase";

/**
 * @description プロパティーエリアの移動イベントを登録
 *              Register property area move events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // プロパティーエリアのタイトルのマウスダウンイベントを登録
    propertyAreaRegisterTitleEventUseCase();

    // プロパティーエリアの移動イベントを登録
    propertyAreaRegisterMoveEventUseCase();
};