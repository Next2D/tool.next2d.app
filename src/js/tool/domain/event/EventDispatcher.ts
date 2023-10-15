/**
 * @description イベントの登録・実行を管理するクラス
 *              Class that manages event registration and execution
 *
 * @class
 * @public
 */
export class EventDispatcher
{
    protected _$events: Map<string, Function[]>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @description イベント関数のマッピング変数
         * @type {Map}
         * @private
         */
        this._$events = new Map();
    }

    /**
     * @description イベント登録関数
     *              event registration function
     *
     * @param  {string} type
     * @param  {function} callback
     * @return {void}
     * @method
     * @public
     */
    addEventListener (type: string, callback: Function): void
    {
        if (!this._$events.has(type)) {
            this._$events.set(type, []);
        }

        const events = this._$events.get(type);
        if (events) {
            events.push(callback);
        }
    }

    /**
     * @description 登録したイベントの起動関数
     *              Launch function for registered events
     *
     * @param  {string} type
     * @param  {MouseEvent|Event} [event=null]
     * @return {void}
     * @method
     * @public
     */
    dispatchEvent (type: string, event: MouseEvent | Event | null = null): void
    {
        if (!this._$events.has(type)) {
            return ;
        }

        const events: Function[] | undefined = this._$events.get(type);
        if (!events || !events.length) {
            return ;
        }

        for (let idx: number = 0; idx < events.length; ++idx) {
            const callback: Function = events[idx];
            callback(event);
        }
    }
}