/**
 * @class
 * @extends {BaseTool}
 */
class TextTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("text");
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
        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
            Util.$setCursor("text");
            this.changeNodeEvent(false);
        });

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            Util.$setCursor("text");

            // 親のイベントを中止する
            event.stopPropagation();

            if (event.screen) {
                this.mouseDown(event);
            }
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            Util.$setCursor("text");

            // 親のイベントを中止する
            event.stopPropagation();

            if (event.screen) {
                this.mouseMove(event);
            }
        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            Util.$setCursor("text");

            if (event.screen) {
                // 親のイベントを中止する
                event.stopPropagation();

                // マウスアップ処理
                this.mouseUp();

                // 選択ツールに戻す
                Util.$tools.reset();
            }
        });
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        // オフセット値を調整
        let offsetX = event.offsetX;
        let offsetY = event.offsetY;
        if (event.target.id !== "stage-area") {
            offsetX += event.target.offsetLeft;
            offsetY += event.target.offsetTop;
        }

        // 初期座標をセット
        this.pageX   = event.pageX;
        this.pageY   = event.pageY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        const element = document.getElementById("draw-text");
        element.style.left    = `${event.pageX}px`;
        element.style.top     = `${event.pageY}px`;
        element.style.width   = "0px";
        element.style.height  = "0px";
        element.style.display = "";
        element.style.border = "1px dashed gray";
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        event.preventDefault();

        const x = event.pageX;
        const y = event.pageY;

        const element = document.getElementById("draw-text");

        if (this.pageX > x) {
            this.offsetX = event.offsetX;
            element.style.left = `${x}px`;
        }
        if (this.pageY > y) {
            this.offsetY = event.offsetY;
            element.style.top = `${y}px`;
        }

        element.style.width  = `${Math.abs(x - this.pageX)}px`;
        element.style.height = `${Math.abs(y - this.pageY)}px`;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        Util.$timelineLayer.attachLayer();

        const element = document.getElementById("draw-text");
        const workSpace = Util.$currentWorkSpace();
        workSpace.temporarilySaved();

        const x      = (this.offsetX - Util.$offsetLeft) / Util.$zoomScale;
        const y      = (this.offsetY - Util.$offsetTop)  / Util.$zoomScale;
        const width  = parseFloat(element.style.width)  / Util.$zoomScale;
        const height = parseFloat(element.style.height) / Util.$zoomScale;

        const id = workSpace.nextLibraryId;
        this.createTextField({
            "id": id,
            "type": "text",
            "name": `Text_${id}`,
            "symbol": "",
            "bounds": {
                "xMin": 0,
                "xMax": width,
                "yMin": 0,
                "yMax": height
            },
            "originBounds": {
                "xMin": 0,
                "xMax": width,
                "yMin": 0,
                "yMax": height
            }
        }, x, y);

        // 再描画
        this.reloadScreen();

        element.style.display = "none";
    }
}
