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
    private _$element: HTMLElement | null;

    /**
     * @description 表示状態を返す
     *              Return display status
     *
     * @return {string}
     * @public
     */
    public state: "show" | "hide";

    /**
     * @description メニュー名を返す
     *              Returns the menu name
     *
     * @return {string}
     * @readonly
     * @public
     */
    public readonly name: string;

    /**
     * @description 各メニューのoffsetLeftの値
     *              Value of offsetLeft for each menu
     *
     * @member {number}
     * @return {number}
     * @public
     */
    public offsetLeft: number;

    /**
     * @description 各メニューのoffsetTopの値
     *              Value of offsetTop for each menu
     *
     * @member {number}
     * @return {number}
     * @public
     */
    public offsetTop: number;

    /**
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name: string)
    {
        this.name       = `${name}`;
        this.state      = "hide";
        this.offsetLeft = 0;
        this.offsetTop  = 0;

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
     * @returns {Promise<void>}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        // eslint-disable-next-line no-useless-return
        return ;
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
        if (!this._$element) {
            return ;
        }

        if (this.state === "show") {
            return ;
        }
        this.state = "show";

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
        if (!this._$element) {
            return ;
        }

        if (this.state === "hide") {
            return ;
        }
        this.state = "hide";

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