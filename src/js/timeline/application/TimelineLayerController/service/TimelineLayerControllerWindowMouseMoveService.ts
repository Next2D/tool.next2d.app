import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description レイヤーコントローラーウィンドウのマウスムーブ処理関数
 *              Mouse move processing function for the layer controller window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("grabbing");
};