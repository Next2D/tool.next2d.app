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

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            this.startRect(event);
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            this.moveRect(event);
        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            this.executeZoom(event);
        });
    }

    /**
     * @description ズーム範囲設定を起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startRect (event)
    {
        this.active = true;
        Util.$setCursor(this._$cursor);

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        const element = document.getElementById("stage-rect");
        element.style.left    = `${event.pageX}px`;
        element.style.top     = `${event.pageY}px`;
        element.style.width   = "0px";
        element.style.height  = "0px";
        element.style.display = "";
    }

    /**
     * @description ズーム範囲設定の矩形を描画
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveRect (event)
    {
        Util.$setCursor(this._$cursor);
        if (!this.active) {
            return ;
        }

        const x = event.pageX;
        const y = event.pageY;

        const element = document.getElementById("stage-rect");

        if (this.pageX > x) {
            element.style.left = `${x}px`;
        }

        if (this.pageY > y) {
            element.style.top = `${y}px`;
        }

        element.style.width  = `${Math.abs(x - this.pageX)}px`;
        element.style.height = `${Math.abs(y - this.pageY)}px`;
    }

    /**
     * @description ズーム範囲でズームを実行
     *
     * @return {void}
     * @method
     * @public
     */
    executeZoom ()
    {
        this.active = false;
        Util.$setCursor(this._$cursor);

        const element = document.getElementById("stage-rect");
        element.style.display = "none";

        const width   = parseFloat(element.style.width);
        const height  = parseFloat(element.style.height);
        if (!width || !height) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();

        const scale = Math.max(
            workSpace.stage.width / width,
            workSpace.stage.height / height,
            Util.$zoomScale
        );

        Util.$zoomScale = 0;
        Util.$screenZoom.execute(scale);

        // ハンドツールを起動
        if (Util.$tools.activeTool) {
            Util
                .$tools
                .activeTool
                .dispatchEvent(EventType.END);
        }

        const tool = Util.$tools.getDefaultTool("zoom");
        tool.dispatchEvent(EventType.START);
        Util.$tools.activeTool = tool;
    }
}
