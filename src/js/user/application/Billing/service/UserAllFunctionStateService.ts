import { $canAllFunction } from "../BillingUtil";

/**
 * @description 全ての機能が利用可能かの情報を返す
 *              Returns information on whether all functions are available
 *
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (): boolean | null =>
{
    return $canAllFunction();
};