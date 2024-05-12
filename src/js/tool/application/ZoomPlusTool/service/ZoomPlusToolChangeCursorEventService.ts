import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description カーソルを変更する
 *              Change the cursor
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    $setCursor("zoom-in");
};