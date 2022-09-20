/**
 * ツールのイベントを管理するクラス
 * Class to manage tool events
 *
 * @class
 */
class EventDispatcher
{
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
     * @param {string} type
     * @param {function} callback
     * @method
     * @public
     */
    addEventListener (type, callback)
    {
        if (!this._$events.has(type)) {
            this._$events.set(type, []);
        }

        this
            ._$events
            .get(type)
            .push(callback);
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
    dispatchEvent (type, event = null)
    {
        if (!this._$events.has(type)) {
            return ;
        }

        const events = this._$events.get(type);
        for (let idx = 0; idx < events.length; ++idx) {
            const callback = events[idx];
            callback(event);
        }
    }
}
