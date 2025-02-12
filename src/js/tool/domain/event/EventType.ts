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
    static get POINTER_DOWN (): "pointerdown"
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
    static get POINTER_UP (): "pointerup"
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
    static get POINTER_MOVE (): "pointermove"
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
    static get POINTER_OVER (): "pointerover"
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
    static get POINTER_OUT (): "pointerout"
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
    static get POINTER_LEAVE (): "pointerleave"
    {
        return "pointerleave";
    }

    /**
     * @description ポインタのキャンセルのイベント名
     *              Event name for pointer cancellation
     *
     * @return {string}
     * @static
     * @const
     */
    static get POINTER_CANCEL (): "pointercancel"
    {
        return "pointercancel";
    }

    /**
     * @description スクリーンエリアのDisplayObject選択時のイベント名
     *              Event name when selecting a DisplayObject in the screen area
     *
     * @return {string}
     * @static
     * @const
     */
    static get DISPLAY_OBJRCY (): "display_objrcy"
    {
        return "display_objrcy";
    }

    /**
     * @description スクリーンエリアのイベント名
     *              Event name of the screen area
     *
     * @return {string}
     * @static
     * @const
     */
    static get SCREEN (): "screen"
    {
        return "screen";
    }

    /**
     * @description スクリーンエリアの範囲選択のイベント名
     *              Event name of the range selection in the screen area
     *
     * @return {string}
     * @static
     * @const
     */
    static get STAGE_RECT (): "stage_rect"
    {
        return "stage_rect";
    }

    /**
     * @description スクリーンエリアのシェイプ範囲選択のイベント名
     *              Event name of the shape range selection in the screen area
     *
     * @return {string}
     * @static
     * @const
     */
    static get DRAW_RECT (): "draw_rect"
    {
        return "draw_rect";
    }

    /**
     * @description スクリーンエリアのカーソル変更のイベント名
     *              Event name for changing the cursor in the screen area
     *
     * @return {string}
     * @static
     * @const
     */
    static get CHANGE_CURSOR (): "change_cursor"
    {
        return "change_cursor";
    }
}