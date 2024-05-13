import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description ズームプラスツールのマウスムーブイベントサービス
 *              Zoom plus tool mouse move event service
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
    $setCursor("zoom-out");
};