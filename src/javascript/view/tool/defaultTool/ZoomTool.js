/**
 * @class
 * @extends {BaseTool}
 */
class ZoomTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("zoom");
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // 専用カーソルを登録
        this.setCursor(
            "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"17\" height=\"17\" viewBox=\"0 0 24 24\"><path d=\"M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z\"/></svg>') 6 6,auto"
        );

        this.addEventListener(EventType.START, () =>
        {
            Util.$setCursor(this._$cursor);
            this.changeNodeEvent(false);
        });

        this.addEventListener(EventType.MOUSE_DOWN, () =>
        {
            Util.$setCursor(this._$cursor);
        });

        this.addEventListener(EventType.MOUSE_MOVE, () =>
        {
            Util.$setCursor(this._$cursor);
        });

        this.addEventListener(EventType.MOUSE_UP, () =>
        {
            Util.$setCursor(this._$cursor);
        });
    }
}
