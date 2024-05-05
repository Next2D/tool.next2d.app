/**
 * @type {boolean}
 * @private
 */
let $sizeLocked: boolean = false;

/**
 * @description 変形のサイズのロック状態を取得
 *              Get the lock state of the transformation size
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getSizeLocked = (): boolean =>
{
    return $sizeLocked;
};

/**
 * @description 変形のサイズのロック状態を更新
 *              Update the lock state of the transformation size
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $setSizeLocked = (lock: boolean): void =>
{
    $sizeLocked = lock;
};

/**
 * @type {boolean}
 * @private
 */
let $scaleLocked: boolean = false;

/**
 * @description 変形のスケールのロック状態を取得
 *              Get the lock state of the transformation scale
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getScaleLocked = (): boolean =>
{
    return $scaleLocked;
};

/**
 * @description 変形のスケールのロック状態を更新
 *              Update the lock state of the transformation scale
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $setScaleLocked = (lock: boolean): void =>
{
    $scaleLocked = lock;
};