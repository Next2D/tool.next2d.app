import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description カーソルを変更する
 *              Change the cursor
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

    $setCursor("zoom-out");
};