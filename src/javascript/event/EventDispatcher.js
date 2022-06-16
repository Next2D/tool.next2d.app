/**
 * @class
 */
class EventDispatcher
{
    /**
     * @description イベント登録関数
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
     * @description イベント発火関数
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
