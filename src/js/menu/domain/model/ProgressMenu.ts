import { $PROGRESS_MENU_NAME } from "../../../config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as progressMenuUpdateMessageService } from "../../application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as progressMenuUpdateStateService } from "../../application/ProgressMenu/service/ProgressMenuUpdateStateService";
import { $setCursor } from "../../../util/Global";
import { $replace } from "../../../language/application/LanguageUtil";

/**
 * @description 進行管理メニュークラス
 *              Progress Control Menu Class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ProgressMenu extends BaseMenu
{
    private _$active: boolean;
    private _$timerId: NodeJS.Timeout | number;
    private _$currentState: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($PROGRESS_MENU_NAME);

        /**
         * @type {boolean}
         * @default false
         * @public
         */
        this._$active = false;

        /**
         * @type {number}
         * @public
         */
        this._$currentState = 0;

        /**
         * @type {number}
         * @public
         */
        this._$timerId = 0;

        // 初期起動は表示
        this.show();
    }

    /**
     * @description タスク進行中であればtrueを返す
     *              Returns true if a task is in progress
     *
     * @returns {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$active;
    }

    /**
     * @description タスク進行の詳細を更新
     *              Update task progress details
     *
     * @params {string}
     * @public
     */
    set message (message: string)
    {
        progressMenuUpdateMessageService(message);
    }

    /**
     * @description タスク進行のパーセント値を更新
     *              Update percent value of task progress
     *
     * @member {number}
     * @public
     */
    get currentState (): number
    {
        return this._$currentState;
    }
    set currentState (state: number)
    {
        this._$currentState = state;
        progressMenuUpdateStateService(state);
    }

    /**
     * @description タスク管理開始関数
     *              Task Management Start Function
     *
     * @returns {void}
     * @method
     * @public
     */
    show (): void
    {
        super.show();

        // 実行判定フラグを更新
        this._$active = true;

        // 事前に起動しているtimerをストップ
        clearInterval(this._$timerId);

        this._$timerId = setInterval(() =>
        {
            this.currentState++;
            if (this.currentState > 95) {
                clearInterval(this._$timerId);
            }
        }, 300);
    }

    /**
     * @description タスク管理終了関数
     *              Task Management End Function
     *
     * @returns {void}
     * @method
     * @public
     */
    hide (): void
    {
        // 終了表示
        this.message      = $replace("{{完了}}");
        this.currentState = 100;

        // timerをストップ
        clearInterval(this._$timerId);

        setTimeout(() =>
        {
            super.hide();

            // reset
            this._$active       = false;
            this._$currentState = 0;

        }, 200);
    }
}