/**
 * @type {boolean}
 * @private
 */
let $pointerId: number = -1;

/**
 * @description 移動対象となったポインターIDを返却
 *              Returns the pointer ID that became the moving target
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getPointerId = (): number =>
{
    return $pointerId;
};

/**
 * @description 移動対象となったポインターIDを更新
 *              Update the pointer ID that became the moving target
 *
 * @param  {number} pointer_id
 * @return {void}
 * @method
 * @public
 */
export const $setPointerId = (pointer_id: number): void =>
{
    $pointerId = pointer_id;
};
