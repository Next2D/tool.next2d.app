/**
 * @type {number}
 * @private
 */
let $targetIndex: number = -1;

/**
 * @description 操作する音声エリアのインデックスを返却
 *              Returns the index of the sound area to operate
 *
 * @return {number}
 * @method
 * @public
 */
export const $getTargetIndex = (): number =>
{
    return $targetIndex;
};

/**
 * @description 操作する音声エリアのインデックスの値を更新
 *              Update the value of the index of the sound area to operate
 *
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const $setTargetIndex = (index: number): void =>
{
    $targetIndex = index;
};
