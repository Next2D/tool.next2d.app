/**
 * @description 機能制限の有効期限の値(YYYY-MM-DD)
 *              Value of expiration date of functional restrictions (YYYYY-MM-DD)
 *
 * @type {string}
 * @private
 */
let $expireDate: string = "";

/**
 * @description 機能制限の有効期限を返却
 *              Return the expiration date of the functional restrictions
 *
 * @return {string}
 * @method
 * @public
 */
export const $getExpireDate = (): string =>
{
    if ($expireDate) {
        return $expireDate;
    }

    const date  = new Date();
    const year  = date.getFullYear();
    const month = ("0" + String(date.getMonth() + 1)).slice(-2);
    const day   = ("0" + String(date.getDate())).slice(-2);
    return `${year}-${month}-${day}`;
};

/**
 * @description 機能制限の有効期限を更新
 *              Update expiration date of functional restrictions
 *
 * @return {string}
 * @method
 * @public
 */
export const $setExpireDate = (ymd: string): void =>
{
    $expireDate = ymd;
};

/**
 * @description 全ての機能が利用可能な状態かを返却
 *              Returns whether all functions are available
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $canAllFunction = (): boolean =>
{
    if (!$expireDate) {
        return false;
    }

    return new Date($expireDate).getTime() > new Date().getTime();
};