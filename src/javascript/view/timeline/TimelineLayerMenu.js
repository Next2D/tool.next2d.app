/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineLayerMenu extends BaseTimeline
{

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const elementIds = [
            "timeline-layer-normal",
            "timeline-layer-mask",
            "timeline-layer-guide"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event);

                // 表示モーダルを全て終了
                Util.$endMenu();
            });
        }
    }

    /**
     * @description ノーマルレイヤーに変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerNormal ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const scene   = Util.$currentWorkSpace().scene;
        const layerId = targetLayer.dataset.layerId | 0;

        const layer = scene.getLayer(layerId);
        if (layer.mode === Util.LAYER_MODE_NORMAL) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = Util.LAYER_MODE_NORMAL;
        layer.showIcon();

        if (reload) {
            this.reloadScreen();
        }

        this._$saved = false;
    }

    /**
     * @description マスクレイヤーに変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerMask ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        if (layer.mode === Util.LAYER_MODE_MASK) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = Util.LAYER_MODE_MASK;
        layer.showIcon();

        if (reload || layer.lock) {
            this.reloadScreen();
        }

        this._$saved = false;
    }

    /**
     * @description ガイドレイヤーに変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerGuide ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        if (layer.mode === Util.LAYER_MODE_GUIDE) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = Util.LAYER_MODE_GUIDE;
        layer.showIcon();

        if (reload) {
            this.reloadScreen();
        }

        this._$saved = false;
    }

    /**
     * @description レイヤー切り替え時にマスクとガイドの入れ子を初期化する
     *
     * @param  {HTMLDivElement} element
     * @return {boolean}
     * @method
     * @public
     */
    resetLayer (element)
    {
        const scene = Util.$currentWorkSpace().scene;

        const layer = scene.getLayer(element.dataset.layerId | 0);

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        let reload = false;
        let index  = children.indexOf(element);
        switch (layer.mode) {

            case Util.LAYER_MODE_MASK:
                for (;;) {
                    const node = children[++index];
                    if (!node) {
                        break;
                    }

                    const layer = scene.getLayer(node.dataset.layerId | 0);
                    if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                        break;
                    }

                    layer.maskId = null;
                    layer.mode   = Util.LAYER_MODE_NORMAL;
                    layer.showIcon();

                    reload = true;
                }
                break;

            case Util.LAYER_MODE_GUIDE:
                for (;;) {
                    const node = children[++index];
                    if (!node) {
                        break;
                    }

                    const layer = scene.getLayer(node.dataset.layerId | 0);
                    if (layer.mode !== Util.LAYER_MODE_GUIDE_IN) {
                        break;
                    }

                    layer.guideId = null;
                    layer.mode    = Util.LAYER_MODE_NORMAL;
                    layer.showIcon();
                }
                break;

            default:
                break;

        }

        return reload;
    }

    /**
     * @description レイヤー切り替えのモーダルを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        // 全てのイベントを中止
        event.stopPropagation();

        Util.$endMenu("timeline-layer-menu");

        const element = document
            .getElementById("timeline-layer-menu");

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - element.clientHeight}px`;
        if (15 > element.offsetTop) {
            element.style.top = "10px";
        }

        if (event.pageY + 15 > window.innerHeight) {
            element.style.top = `${event.pageY - element.clientHeight - 15}px`;
        }

        element.setAttribute("class", "fadeIn");
    }
}

Util.$timelineLayerMenu = new TimelineLayerMenu();