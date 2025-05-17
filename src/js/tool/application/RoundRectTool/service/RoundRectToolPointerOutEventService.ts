import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description シェイプの角丸矩形ツールのマウスムーブイベントサービス
 *              Mouse move event service of shape rounded rectangle tool
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