import { BaseMenu } from "./BaseMenu";

/**
 * @description ユーザー設定メニュークラス
 *              User setting menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class UserSettingMenu extends BaseMenu
{
    private _$timerId: NodeJS.Timeout | number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("user-setting");

        /**
         * @type {number}
         * @private
         */
        this._$timerId = -1;
    }

    /**
     * @description メニュー位置を補正
     *              Correct menu position
     *
     * @return {HTMLElement}
     * @method
     * @public
     */
    move (element: HTMLElement): HTMLElement
    {
        element.style.left = `${this._$offsetLeft}px`;
        element.style.top  = `${this._$offsetTop}px`;

        return element;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        this.setOffset();

        // リサイズ時には座標を再取得
        window.addEventListener("resize", (): void =>
        {
            clearTimeout(this._$timerId);
            this._$timerId = setTimeout(() =>
            {
                this.setOffset();
            }, 200);
        });
    }

    /**
     * @description メニュー表示位置の座標をセット
     *              Set the coordinates of the menu display position
     *
     * @return {void}
     * @method
     * @public
     */
    setOffset (): void
    {
        const menu: HTMLElement | null = document
            .getElementById("user-setting");

        if (!menu) {
            return ;
        }

        const tool: HTMLElement | null = document
            .getElementById("tools-setting");

        if (!tool) {
            return ;
        }

        this._$offsetLeft = tool.offsetLeft + 30;
        this._$offsetTop  = tool.offsetTop - menu.clientHeight + 80;
    }
}