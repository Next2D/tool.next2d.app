/**
 * @class
 * @extends {BaseTool}
 */
class PenTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("pen");
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
            this.setCursor();
            this.changeNodeEvent(false);
        });

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();

            // ペンで追加したElementを削除
            Util.$clearPenPointer();

            // 初期座標をセット
            let offsetX = event.offsetX;
            let offsetY = event.offsetY;
            if (event.target.id !== "stage-area") {
                offsetX += event.target.offsetLeft;
                offsetY += event.target.offsetTop;
            }

            this.offsetX = offsetX;
            this.offsetY = offsetY;
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();

            if (event.screen && this.active) {
                this.mouseMove(event);
            }
        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();

            this.mouseUp();
        });
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    setCursor ()
    {
        const color = Util.$intToRGB(
            `0x${document.getElementById("stroke-color").value.slice(1)}` | 0
        );
        Util.$setCursor(`url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="rgb(${color.R},${color.G},${color.B})" d="M1.438 16.875l5.688 5.689-7.126 1.436 1.438-7.125zm22.562-11.186l-15.46 15.46-5.688-5.689 15.459-15.46 5.689 5.689zm-4.839-2.017l-.849-.849-12.614 12.599.85.849 12.613-12.599z"/></svg>') 0 12, auto`);
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        const width = document.getElementById("stroke-size").value | 0;
        if (width) {

            event.preventDefault();

            let x = event.offsetX;
            let y = event.offsetY;
            if (event.target.id !== "stage-area") {
                x += event.target.offsetLeft;
                y += event.target.offsetTop;
            }

            const element = document.getElementById("stage-area");

            const div = document.createElement("div");
            div.dataset.penPointer = "true";
            div.classList.add("pen-pointer");

            div.style.width           = `${width}px`;
            div.style.height          = `${width}px`;
            div.style.left            = `${x}px`;
            div.style.top             = `${y}px`;
            div.style.backgroundColor = document.getElementById("stroke-color").value;
            div.style.borderRadius    = `${width / 2}px`;

            element.appendChild(div);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        this.attachLayer();
        if (Util.$timeline._$targetLayer) {

            const { Shape } = window.next2d.display;

            const thickness = document
                .getElementById("stroke-size").value | 0;

            const shape = new Shape();
            shape.graphics.lineStyle(
                thickness,
                document.getElementById("stroke-color").value
            );

            const x = this.offsetX - Util.$offsetLeft;
            const y = this.offsetY - Util.$offsetTop;
            shape.graphics.moveTo(0, 0);

            const element  = document.getElementById("stage-area");
            const children = element.children;
            for (let idx = 0; children.length > idx; ++idx) {

                const node = children[idx];
                if (!node.dataset.penPointer) {
                    continue;
                }

                shape.graphics.lineTo(
                    (node.offsetLeft - Util.$offsetLeft - x) / Util.$zoomScale,
                    (node.offsetTop  - Util.$offsetTop  - y) / Util.$zoomScale
                );

                node.remove();
                --idx;
            }
            shape.graphics.endLine();

            const id = Util.$currentWorkSpace().nextLibraryId;
            this.createShape({
                "id": id,
                "type": "shape",
                "name": `Shape_${id}`,
                "symbol": "",
                "recodes": shape.graphics._$recode.slice(0),
                "bounds": {
                    "xMin": shape.graphics._$xMin,
                    "xMax": shape.graphics._$xMax,
                    "yMin": shape.graphics._$yMin,
                    "yMax": shape.graphics._$yMax
                }},
                (x + thickness / 2) / Util.$zoomScale,
                (y + thickness / 2) / Util.$zoomScale
            );

            // 再描画
            this.reloadScreen();

            Util.$tools.reset();
        }

    }
}
