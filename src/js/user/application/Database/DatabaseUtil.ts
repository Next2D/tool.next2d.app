/**
 * @type {boolean}
 * @private
 */
let $savingStatus: boolean = false;

/**
 * @description 保存中かどうかを返却します。
 *              Returns whether it is saving or not.
 *
 * @return {void}
 * @method
 * @public
 */
export const $isSaving = (): boolean =>
{
    return $savingStatus;
};

/**
 * @description 保存中フラグを立てます。
 *              Sets the saving flag.
 *
 * @return {void}
 * @method
 * @public
 */
export const $startSaving = (): void =>
{
    $savingStatus = true;
};

/**
 * @description 保存中フラグを下げます。
 *              Lowers the saving flag.
 *
 * @return {void}
 * @method
 * @public
 */
export const $endSaving = (): void =>
{
    $savingStatus = false;
};