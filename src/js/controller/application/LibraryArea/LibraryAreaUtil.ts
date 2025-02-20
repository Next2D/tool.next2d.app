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
 * @type {number}
 * @default -1
 * @private
 */
let $nameSelectedLibraryId: number = -1;

/**
 * @description 選択中のライブラリエリアの名前入力中IDを設定
 *              Set the ID of the name being entered in the selected library area
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const $setNameSelectedLibraryId = (library_id: number): void =>
{
    $nameSelectedLibraryId = library_id;
};

/**
 * @description 選択中のライブラリエリアの名前入力中IDを取得
 *              Get the ID of the name being entered in the selected library area
 *
 * @returns {number}
 * @method
 * @public
 */
export const $getNameSelectedLibraryId = (): number =>
{
    return $nameSelectedLibraryId;
};

/**
 * @type {number}
 * @default -1
 * @private
 */
let $symbolSelectedLibraryId: number = -1;

/**
 * @description 選択中のライブラリエリアのシンボル入力中IDを設定
 *              Set the ID of the symbol being entered in the selected library area
 *
 * @param  {number} library_id
 * @return
 * @method
 * @public
 */
export const $setSymbolSelectedLibraryId = (library_id: number): void =>
{
    $symbolSelectedLibraryId = library_id;
};

/**
 * @description 選択中のライブラリエリアのシンボル入力中IDを取得
 *              Get the ID of the symbol being entered in the selected library area
 *
 * @returns {number}
 * @method
 * @public
 */
export const $getSymbolSelectedLibraryId = (): number =>
{
    return $symbolSelectedLibraryId;
};