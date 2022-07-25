/**
 * @class
 * @extends {BaseController}
 */
class Controller extends BaseController
{
    /**
     * @constructor
     */
    constructor()
    {
        super();
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        super.initialize();

        const controller = document
            .getElementById("controller");

        if (controller) {
            controller.addEventListener("mouseover", () =>
            {
                Util.$setCursor("auto");
            });
        }

        // window.addEventListener("mousemove", function (event)
        // {
        //     // if (this._$easeMode) {
        //     //
        //     //     window.requestAnimationFrame(function (screen_x, screen_y, element)
        //     //     {
        //     //         const layerElement = Util.$timeline._$targetLayer;
        //     //         if (!layerElement) {
        //     //             return ;
        //     //         }
        //     //
        //     //         let x = element.offsetLeft + screen_x - this._$pointX;
        //     //         let y = element.offsetTop  + screen_y - this._$pointY;
        //     //
        //     //         // update
        //     //         this._$pointX = screen_x;
        //     //         this._$pointY = screen_y;
        //     //
        //     //         if (Util.EASE_MIN_POINTER_Y > y) {
        //     //             y = Util.EASE_MIN_POINTER_Y;
        //     //         }
        //     //
        //     //         if (Util.EASE_MAX_POINTER_Y < y) {
        //     //             y = Util.EASE_MAX_POINTER_Y;
        //     //         }
        //     //
        //     //         if (Util.EASE_MIN_POINTER_X > x) {
        //     //             x = Util.EASE_MIN_POINTER_X;
        //     //         }
        //     //
        //     //         if (Util.EASE_MAX_POINTER_X < x) {
        //     //             x = Util.EASE_MAX_POINTER_X;
        //     //         }
        //     //
        //     //         element.style.left = `${x}px`;
        //     //         element.style.top  = `${y}px`;
        //     //
        //     //         const layerId = layerElement.dataset.layerId | 0;
        //     //
        //     //         const layer = Util
        //     //             .$currentWorkSpace()
        //     //             .scene
        //     //             .getLayer(layerId);
        //     //
        //     //         const character = layer.getActiveCharacter(
        //     //             Util.$timelineFrame.currentFrame
        //     //         )[0];
        //     //
        //     //         const tween  = character.getTween();
        //     //         const custom = tween.custom[element.dataset.index];
        //     //
        //     //         const scale = Util.EASE_BASE_CANVAS_SIZE / Util.EASE_RANGE;
        //     //         custom.x = (x - Util.EASE_SCREEN_X) / scale;
        //     //         custom.y = (Util.EASE_MOVE_Y - y) / scale;
        //     //
        //     //         document
        //     //             .getElementById("ease-cubic-current-text")
        //     //             .textContent = `(${(custom.x / Util.EASE_RANGE * 100) | 0})`;
        //     //
        //     //         document
        //     //             .getElementById("ease-cubic-current-tween")
        //     //             .textContent = `(${(custom.y / Util.EASE_RANGE * 100) | 0})`;
        //     //
        //     //         // restart
        //     //         this.createEasingGraph();
        //     //         Util.$screen.executeTween(layer);
        //     //         Util.$screen.createTweenMarker();
        //     //
        //     //         const onionElement = document
        //     //             .getElementById("timeline-onion-skin");
        //     //
        //     //         if (onionElement.classList.contains("onion-skin-active")) {
        //     //             Util.$currentWorkSpace().scene.changeFrame(
        //     //                 Util.$timelineFrame.currentFrame
        //     //             );
        //     //         }
        //     //
        //     //     }.bind(this, event.screenX, event.screenY, this._$easeTarget));
        //     //
        //     // }
        //
        // }.bind(this));
    }

    /**
     * @description 指定したIDを表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    showObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "";
        }
    }

    /**
     * @description 指定したIDを非表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    hideObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "none";
        }
    }

    /**
     * @description 初期表示に戻す
     *
     * @return {void}
     * @method
     * @public
     */
    default ()
    {
        // フィルターを初期化
        Util.$filterController.clearFilters();

        this.hideObjectSetting([
            "object-area",
            "instance-setting",
            "fill-color-setting"
        ]);

        this.showObjectSetting([
            "stage-setting",
            "sound-setting",
            "object-setting",
            "color-setting",
            "blend-setting",
            "filter-setting"
        ]);

        const scene = Util.$currentWorkSpace().scene;

        document
            .getElementById("object-name")
            .value = scene.name;

        document
            .getElementById("object-symbol")
            .value = scene.symbol;
    }
}

Util.$controller = new Controller();
