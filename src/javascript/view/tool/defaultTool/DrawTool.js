/**
 * @class
 * @extends {BaseTool}
 */
class DrawTool extends BaseTool
{
    /**
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name)
    {
        super(name);
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
        this.setCursor("crosshair");

        this.addEventListener(EventType.START, () =>
        {
            Util.$setCursor(this._$cursor);
            this.changeNodeEvent(false);
        });

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            Util.$setCursor(this._$cursor);
            this.active = !!event.screen;
            if (event.screen) {
                this.mouseDown(event);
            }
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            Util.$setCursor(this._$cursor);
            if (event.screen && this.active) {

                // 親のイベントを中止する
                event.stopPropagation();

                this.mouseMove(event);
            }
        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            Util.$setCursor(this._$cursor);

            // 親のイベントを中止する
            event.stopPropagation();

            if (event.screen) {

                Util.$timelineLayer.attachLayer();
                this.createCharacter();

                document
                    .getElementById("draw-rect")
                    .style.display = "none";

                Util.$tools.reset();
            }
        });
    }

    /**
     * @description 指定の座標に描画を行う
     *
     * @param  {string} name
     * @return {void}
     * @method
     * @public
     */
    createCharacter (name)
    {
        const element = document.getElementById("draw-rect");

        const { Graphics } =  window.next2d.display;

        const strokeSize = document
            .getElementById("stroke-size")
            .value | 0;

        const width  = (parseFloat(element.style.width)  + strokeSize) / Util.$zoomScale;
        const height = (parseFloat(element.style.height) + strokeSize) / Util.$zoomScale;
        if (width && height) {

            const workSpace = Util.$currentWorkSpace();
            workSpace.temporarilySaved();

            // draw
            const graphics = new Graphics();

            graphics
                .beginFill(document.getElementById("fill-color").value, 1);

            switch (name) {

                case "rectangle":
                    graphics.drawRect(0, 0, width, height);
                    break;

                case "circle":
                    graphics.drawEllipse(0, 0, width, height);
                    break;

                case "round-rect":
                    graphics.drawRoundRect(
                        0, 0, width, height,
                        Math.min(width, height) / 4
                    );
                    break;

            }
            graphics.endFill();

            const x  = (this.offsetX - Util.$offsetLeft) / Util.$zoomScale;
            const y  = (this.offsetY - Util.$offsetTop)  / Util.$zoomScale;
            const id = workSpace.nextLibraryId;

            this.createShape({
                "id": id,
                "type": InstanceType.SHAPE,
                "name": `Shape_${id}`,
                "symbol": "",
                "recodes": graphics._$recode ? graphics._$recode.slice(0) : [],
                "bounds": {
                    "xMin": 0,
                    "xMax": width,
                    "yMin": 0,
                    "yMax": height
                }
            }, x + strokeSize / 2, y + strokeSize / 2);

            if (strokeSize) {

                const graphics = new Graphics();
                graphics
                    .lineStyle(
                        strokeSize,
                        document.getElementById("stroke-color").value
                    );

                switch (name) {

                    case "rectangle":
                        graphics.drawRect(0, 0, width, height);
                        break;

                    case "circle":
                        graphics.drawEllipse(0, 0, width, height);
                        break;

                    case "round-rect":
                        graphics.drawRoundRect(
                            0, 0, width, height,
                            Math.min(width, height) / 4
                        );
                        break;

                }
                graphics.endLine();

                const offsetX = Math.abs(graphics._$xMax - graphics._$xMin) - width;
                const offsetY = Math.abs(graphics._$yMax - graphics._$yMin) - height;

                const x = this.offsetX - Util.$offsetLeft;
                const y = this.offsetY - Util.$offsetTop;

                const id = workSpace.nextLibraryId;

                this.createShape({
                    "id": id,
                    "type": InstanceType.SHAPE,
                    "name": `Shape_${id}`,
                    "symbol": "",
                    "recodes": graphics._$recode ? graphics._$recode.slice(0) : [],
                    "bounds": {
                        "xMin": -offsetX / 2,
                        "xMax": width + offsetX / 2,
                        "yMin": -offsetY / 2,
                        "yMax": height + offsetY / 2
                    }
                }, x + offsetX / 2, y + offsetY / 2);

            }

            // 再描画
            this.reloadScreen();
        }
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.offsetX = event.offsetX;
        this.offsetY = event.offsetY;
        if (event.target.id !== "stage-area") {
            this.offsetX += event.target.offsetLeft;
            this.offsetY += event.target.offsetTop;
        }

        const element = document.getElementById("draw-rect");

        element.style.left    = `${event.pageX}px`;
        element.style.top     = `${event.pageY}px`;
        element.style.width   = "0px";
        element.style.height  = "0px";
        element.style.display = "";

        // fill color
        element.style.background = document.getElementById("fill-color").value;

        // stroke reset
        element.style.borderRadius = "";
        element.style.border       = "";

        const strokeSize = document.getElementById("stroke-size").value | 0;
        if (strokeSize) {
            element.style.borderRadius = `${strokeSize}px`;
            element.style.border       = `${strokeSize}px solid ${document.getElementById("stroke-color").value}`;
        }
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

        const element = document.getElementById("draw-rect");
        if (this.name === "circle") {
            element.style.borderRadius = "50%";
        }

        if (Util.$shiftKey) {

            const max = Math.max(
                Math.abs(x - this.pageX),
                Math.abs(y - this.pageY)
            );

            if (this.pageX < x) {
                element.style.left = `${this.pageX}px`;
            }
            if (this.pageY < y) {
                element.style.top = `${this.pageY}px`;
            }

            if (this.pageX > x) {
                this.offsetX = event.offsetX;
                element.style.left = `${this.pageX - max}px`;
            }
            if (this.pageY > y) {
                this.offsetY = event.offsetY;
                element.style.top = `${this.pageY - max}px`;
            }

            element.style.width  = `${max}px`;
            element.style.height = `${max}px`;

        } else {

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

        if (this.name === "round-rect") {
            const min = Math.min(
                parseFloat(element.style.width),
                parseFloat(element.style.height)
            );
            element.style.borderRadius = `${min / 8 | 0}px`;
        }
    }
}
