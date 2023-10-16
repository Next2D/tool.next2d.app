import { $USER_MENU_NAME } from "../../../const/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as userSettingInitializeUseCase } from "../../application/usecase/UserSettingInitializeUseCase";

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
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($USER_MENU_NAME);
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
        userSettingInitializeUseCase();

        // // 各種イベントを登録
        // this._$registerEvent();

        // ユーザー個別データの読み込み
    }
    /**
     * @description 初期起動時に各種イベントを登録
     *              Register various events at initial startup
     *
     * @return {void}
     * @method
     * @public
     */
    _$registerEvent (): void
    {
        // TODO
    }
}