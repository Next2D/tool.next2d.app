import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 変更したスクリプトに上書きする
 *              Overwrite modified scripts
 *
 * @param  {number} frame
 * @param  {string} script
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, script: string): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .setAction(frame, script);
};