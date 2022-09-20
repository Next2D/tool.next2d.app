/**
 * イベントの型の固定値
 * Fixed value of event type
 *
 * @class
 */
class EventType
{
    /**
     * @description マウスダウンのイベント名
     *              Mouse down event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_DOWN ()
    {
        return "mousedown";
    }

    /**
     * @description マウスアップのイベント名
     *              Mouse-up event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_UP ()
    {
        return "mouseup";
    }

    /**
     * @description マウスムーブのイベント名
     *              Mouse move event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_MOVE ()
    {
        return "mousemove";
    }

    /**
     * @description ツール起動時のイベント名
     *              Event name at tool startup
     *
     * @return {string}
     * @static
     * @const
     */
    static get START ()
    {
        return "start";
    }

    /**
     * @description ツール終了時のイベント名
     *              Event name at end of tool
     *
     * @return {string}
     * @static
     * @const
     */
    static get END ()
    {
        return "end";
    }

    /**
     * @description ダブルクリック時のイベント名
     *              Event name on double-click
     *
     * @return {string}
     * @static
     * @const
     */
    static get DBL_CLICK ()
    {
        return "dblclick";
    }

    /**
     * @description Input、Selectの変更時のイベント名
     *              Event name when Input or Select is changed
     *
     * @return {string}
     * @static
     * @const
     */
    static get CHANGE ()
    {
        return "change";
    }

    /**
     * @description マウスオーバのイベント名
     *              Mouse over event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_OVER ()
    {
        return "mouseover";
    }

    /**
     * @description マウスアウトのイベント名
     *              Mouse-out event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_OUT ()
    {
        return "mouseout";
    }

    /**
     * @description キーボード押下のイベント名
     *              Event name for keyboard presses
     *
     * @return {string}
     * @static
     * @const
     */
    static get KEY_DOWN ()
    {
        return "keydown";
    }

    /**
     * @description マウスが指定領域から出た際のイベント名
     *              Event name when the mouse leaves the specified area
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_LEAVE ()
    {
        return "mouseleave";
    }
}

