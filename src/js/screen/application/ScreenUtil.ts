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

/**
 * @type {boolean}
 * @private
 */
let $doReloadScreen: boolean = false;

/**
 * @description スクリーンの再描画を後で行うかをセット
 *              Sets whether the screen will be redrawn later
 *
 * @returns {void}
 * @method
 * @public
 */
export const setReloadLater = (): void =>
{
    $doReloadScreen = true;
};

/**
 * @description スクリーンの再描画を後で行うかを判別
 *              Determines if the screen will be redrawn later
 *
 * @returns {void}
 * @method
 * @public
 */
export const doReloadLater = (): boolean =>
{
    return $doReloadScreen;
};

/**
 * @description スクリーンの再描画を行う
 *              Redraw the screen.
 *
 * @returns {Promise}
 * @method
 * @public
 */
export const $reloadScreen = (): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        resolve();
    });
};