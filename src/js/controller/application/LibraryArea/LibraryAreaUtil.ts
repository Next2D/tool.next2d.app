/**
 * @type {number}
 * @default 0
 * @private
 */
let $moveOffsetX: number = 0;

/**
 * @description 移動オフセットXを設定
 *              Set move offset X
 *
 * @param  {number} offset_x
 * @return {void}
 * @method
 * @public
 */
export const $setMoveOffsetX = (offset_x: number): void =>
{
    $moveOffsetX = offset_x;
};

/**
 * @description 移動オフセットXを取得
 *              Get move offset X
 *
 * @return {number}
 * @method
 * @public
 */
export const $getMoveOffsetX = (): number =>
{
    return $moveOffsetX;
};

/**
 * @type {number}
 * @default 0
 * @private
 */
let $moveOffsetY: number = 0;

/**
 * @description 移動オフセットYを設定
 *              Set move offset Y
 *
 * @param  {number} offset_y
 * @return {void}
 * @method
 * @public
 */
export const $setMoveOffsetY = (offset_y: number): void =>
{
    $moveOffsetY = offset_y;
};

/**
 * @description 移動オフセットYを取得
 *              Get move offset Y
 *
 * @return {number}
 * @method
 * @public
 */
export const $getMoveOffsetY = (): number =>
{
    return $moveOffsetY;
};

/**
 * @type {boolean}
 * @default false
 * @private
 */
let $moveState: boolean = false;

/**
 * @description 移動状態を設定
 *              Set move state
 *
 * @param  {boolean} state
 * @return {void}
 * @method
 * @public
 */
export const $setMoveState = (move_state: boolean): void =>
{
    $moveState = move_state;
};

/**
 * @description 移動状態を取得
 *              Get move state
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getMoveState = (): boolean =>
{
    return $moveState;
};

/**
 * @type {HTMLElement | null}
 * @default null
 * @private
 */
let $editingElement: HTMLElement | null = null;

/**
 * @description 編集中のElementをセット
 *              Set the editing Element
 *
 * @param  {HTMLElement | null} element
 * @return {void}
 * @method
 * @public
 */
export const $setEditingElement = (element: HTMLElement | null): void =>
{
    $editingElement = element;
};

/**
 * @description 編集中のElementを取得
 *              Get the editing Element
 *
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const $getEditingElement = (): HTMLElement | null =>
{
    return $editingElement;
};