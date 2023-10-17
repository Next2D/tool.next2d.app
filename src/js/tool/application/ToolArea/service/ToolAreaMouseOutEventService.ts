import { $setCursor } from "../../../../util/Global";

/**
 * @description スクリーンエリアのDisplayObjectにマウスが乗った時の処理
 *              Processing when the mouse hovers over a DisplayObject in the screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    // カーソルを初期化
    $setCursor("auto");
};