import { $registerMenu } from "../../application/MenuUtil";

/**
 * @description 各種メニュークラスの親クラス
 *              Parent class of various menu classes
 *
 * @class
 * @public
 */
export class BaseMenu
{
    protected _$state: "show" | "hide";
    private _$element: HTMLElement | null;
    private _$name: string;
    private _$offsetLeft: number;
    private _$offsetTop: number;

    /**
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name: string)
    {
        /**
         * @type {string}
         * @private
         */
        this._$name = `${name}`;

        /**
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetLeft = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetTop = 0;

        /**
         * @type {HTMLElement}
         * @default null
         * @private
         */
        this._$element = document.getElementById(name);

        // メニュー用のマップに登録
        $registerMenu(this);
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get name (): string
    {
        return this._$name;
    }

    /**
     * @description 各メニューのoffsetLeftの値
     *              Value of offsetLeft for each menu
     *
     * @member {number}
     * @return {number}
     * @public
     */
    get offsetLeft (): number
    {
        return this._$offsetLeft;
    }
    set offsetLeft (offset_left: number)
    {
        this._$offsetLeft = offset_left;
    }

    /**
     * @description 各メニューのoffsetTopの値
     *              Value of offsetTop for each menu
     *
     * @member {number}
     * @return {number}
     * @public
     */
    get offsetTop (): number
    {
        return this._$offsetTop;
    }
    set offsetTop (offset_top: number)
    {
        this._$offsetTop = offset_top;
    }

    /**
     * @description メニューを表示
     *              Show menu
     *
     * @return {void}
     * @method
     * @public
     */
    show (): void
    {
        if (this._$state === "show") {
            return ;
        }
        this._$state = "show";

        if (!this._$element) {
            return ;
        }

        this.move(this._$element);
        this._$element.setAttribute("class", "fadeIn");
    }

    /**
     * @description メニューを非表示
     *              Hide menu
     *
     * @return {void}
     * @method
     * @public
     */
    hide (): void
    {
        if (this._$state === "hide") {
            return ;
        }
        this._$state = "hide";

        if (!this._$element) {
            return ;
        }

        this._$element.setAttribute("class", "fadeOut");
    }

    /**
     * @description メニューの表示を調整する場合は小クラスで定義する
     *              To adjust the menu display, define it in a small class
     *
     * @return {HTMLElement}
     * @method
     * @abstract
     */
    move (element: HTMLElement): HTMLElement
    {
        return element;
    }
}