import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 変更前のスクリプトに上書きする
 *              Overwrite the script before modification
 *
 * @param  {number} frame
 * @param  {string} before_script
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, before_script: string): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .setAction(frame, before_script);
};