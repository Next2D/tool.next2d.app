/**
 * @description 移動対象のElementを一時保存
 *              Temporarily save the Element to be moved
 *
 * @type {HTMLElement}
 * @default null
 * @private
 */
let draggedElement: HTMLElement | null = null;

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
    draggedElement = element;
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
    return draggedElement;
};
