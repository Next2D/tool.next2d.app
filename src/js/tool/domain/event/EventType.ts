/**
 * @description イベントの型の固定値
 *              Fixed value of event type
 *
 * @class
 * @public
 */
export class EventType
{
    /**
     * @description マウスダウンのイベント名
     *              Mouse down event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_DOWN (): "pointerdown"
    {
        return "pointerdown";
    }

    /**
     * @description マウスアップのイベント名
     *              Mouse-up event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_UP (): "pointerup"
    {
        return "pointerup";
    }

    /**
     * @description マウスムーブのイベント名
     *              Mouse move event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_MOVE (): "pointermove"
    {
        return "pointermove";
    }

    /**
     * @description ツール起動時のイベント名
     *              Event name at tool startup
     *
     * @return {string}
     * @static
     * @const
     */
    static get START (): "start"
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
    static get END (): "end"
    {
        return "end";
    }

    /**
     * @description Input、Selectの変更時のイベント名
     *              Event name when Input or Select is changed
     *
     * @return {string}
     * @static
     * @const
     */
    static get CHANGE (): "change"
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
    static get MOUSE_OVER (): "pointerover"
    {
        return "pointerover";
    }

    /**
     * @description マウスアウトのイベント名
     *              Mouse-out event name
     *
     * @return {string}
     * @static
     * @const
     */
    static get MOUSE_OUT (): "pointerout"
    {
        return "pointerout";
    }

    /**
     * @description キーボード押下のイベント名
     *              Event name for keyboard presses
     *
     * @return {string}
     * @static
     * @const
     */
    static get KEY_DOWN (): "keydown"
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
    static get MOUSE_LEAVE (): "pointerleave"
    {
        return "pointerleave";
    }
}