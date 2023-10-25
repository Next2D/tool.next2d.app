/**
 * @description Viewコンテナのタブ管理クラス
 *              Tab management class for View container
 *
 * @class
 * @public
 */
export class ViewTab
{
    private readonly _$element: HTMLElement;

    /**
     * @param {HTMLElement} element
     * @constructor
     * @public
     */
    constructor (element: HTMLElement)
    {
        /**
         * @type {HTMLElement}
         * @private
         */
        this._$element = element;
    }
}