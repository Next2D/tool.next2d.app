/**
 * @description 移動対象のElementを一時保存
 *              Temporarily save the Element to be moved
 *
 * @type {HTMLElement}
 * @default null
 * @private
 */
let $draggedElement: HTMLElement | null = null;

/**
 * @description 移動選択したタブのElementを一時保存、初期化はnullをセット
 *              Temporarily saves the Element of the tab selected for moving, initialization is set to null.
 *
 * @params  {HTMLElement | null} element
 * @returns {void}
 * @method
 * @public
 */
export const $setDragElement = (element: HTMLElement | null): void =>
{
    $draggedElement = element;
};

/**
 * @description 移動選択したタブのElementを返却
 *              Move Returns the Element of the selected tab
 *
 * @returns {HTMLElement | null}
 * @method
 * @public
 */
export const $getDragElement = (): HTMLElement | null =>
{
    return $draggedElement;
};

/**
 * @type {string}
 * @default "hide"
 * @private
 */
let $targetRectState: string = "hide";

/**
 * @description 選択範囲のElementの表示状態を更新
 *              Update the display state of the selected range Element
 *
 * @param {string} state
 * @return {void}
 * @method
 * @public
 */
export const $setTargetRectState = (state: string): void =>
{
    $targetRectState = state;
};

/**
 * @description 選択範囲のElementの表示状態を返却
 *              Returns the display state of the selected range Element
 *
 * @return {string}
 * @method
 * @public
 */
export const $getTargetRectState = (): string =>
{
    return $targetRectState;
};