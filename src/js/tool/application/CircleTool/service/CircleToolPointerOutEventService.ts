import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description シェイプの円ツールのマウスムーブイベントサービス
 *              Shape Circle Tool Mouse Move Event Service
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

    // カーソルを変更
    $setCursor("auto");
};