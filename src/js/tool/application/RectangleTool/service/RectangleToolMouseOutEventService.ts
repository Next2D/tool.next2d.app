import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description シェイプの矩形ツールのマウスムーブイベントサービス
 *              Mouse-move event service of shape rectangle tool
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
    $setCursor("auto");
};