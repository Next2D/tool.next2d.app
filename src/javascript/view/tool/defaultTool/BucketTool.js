/**
 * @class
 * @extends {BaseTool}
 */
class BucketTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("bucket");
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
            this.changeNodeEvent();
        });

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();

            if (event.displayObject) {
                this.mouseDown(event);
            }
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();
        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            this.setCursor();

            // 親のイベントを中止する
            event.stopPropagation();

            Util.$tools.reset();
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
            `0x${document.getElementById("fill-color").value.slice(1)}` | 0
        );
        Util.$setCursor(`url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(${color.R},${color.G},${color.B})" d="M24 19.007c0-3.167-1.409-6.771-2.835-9.301l-.006-.01-.014-.026c-.732-1.392-1.914-3.052-3.619-4.757-2.976-2.976-5.476-3.912-6.785-3.913-.413 0-.708.094-.859.245l-.654.654c-1.898-.236-3.42.105-4.294.982-.876.875-1.164 2.159-.792 3.524.242.893.807 1.891 1.752 2.836.867.867 2.062 1.684 3.615 2.327.488-.839 1.654-1.019 2.359-.315.586.586.584 1.533-.002 2.119s-1.533.589-2.121 0c-.229-.229-.366-.515-.416-.812-1.646-.657-3.066-1.534-4.144-2.612-.728-.728-1.289-1.528-1.664-2.349l-2.835 2.832c-.445.447-.685 1.064-.686 1.82.001 1.635 1.122 3.915 3.714 6.506 2.764 2.764 5.58 4.243 7.431 4.243.649 0 1.181-.195 1.548-.562l8.086-8.079c.911.875-.777 3.541-.777 4.65 0 1.104.896 1.999 2 1.998 1.104 0 1.998-.895 1.998-2zm-18.912-12.974c-.236-.978-.05-1.845.554-2.444.526-.53 1.471-.791 2.656-.761l-3.21 3.205zm9.138 2.341l-.03-.029c-1.29-1.291-3.802-4.354-3.095-5.062.715-.715 3.488 1.521 5.062 3.095.862.863 2.088 2.248 2.938 3.459-1.718-1.073-3.493-1.469-4.875-1.463zm-3.875 12.348c-.547-.082-1.5-.547-1.9-.928l7.086-7.086c.351.37 1.264.931 1.753 1.075l-6.939 6.939z"/></svg>'),auto`);
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        const element = event.target;
        if (element.dataset.instanceType === "shape") {

            const { Graphics } = window.next2d.display;

            const workSpace = Util.$currentWorkSpace();
            workSpace.temporarilySaved();

            const instance = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const color = Util.$intToRGB(
                `0x${document.getElementById("fill-color").value.slice(1)}` | 0
            );

            switch (instance._$recodes[instance._$recodes.length - 1]) {

                case Graphics.END_FILL:
                    instance._$recodes.splice(
                        instance._$recodes.length - 6,
                        6,
                        Graphics.FILL_STYLE,
                        color.R,
                        color.G,
                        color.B,
                        255,
                        Graphics.END_FILL
                    );
                    break;

                case Graphics.END_STROKE:
                    instance._$recodes.push(
                        Graphics.FILL_STYLE,
                        color.R,
                        color.G,
                        color.B,
                        255,
                        Graphics.END_FILL
                    );
                    break;

                default:
                    break;

            }

            instance.cacheClear();

            // 再描画
            this.reloadScreen();
        }
    }
}
