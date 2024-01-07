import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリプトを削除する
 *              Delete Script
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .deleteAction(frame);
};