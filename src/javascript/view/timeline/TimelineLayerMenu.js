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
            "timeline-layer-mask"
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

        let changeNormal = false;
        for (const layer of scene._$layers.values()) {

            if (layer.id === layerId) {

                const mode = layer.mode;

                // change
                layer.mode = Util.LAYER_MODE_NORMAL;
                layer.showIcon();

                if (mode !== Util.LAYER_MODE_MASK) {
                    break;
                }

                changeNormal = true;

                continue;
            }

            if (changeNormal) {

                if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                    break;
                }

                // マスクの入れ子を解除
                layer.maskId = null;
                layer.mode   = Util.LAYER_MODE_NORMAL;
                layer.showIcon();
            }

        }

        if (changeNormal) {
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

        if (layer.mode !== Util.LAYER_MODE_MASK) {

            // 状態を保存
            this.save();

            layer.mode = Util.LAYER_MODE_MASK;
            layer.showIcon();

            if (layer.lock) {
                this.reloadScreen();
            }

            this._$saved = false;
        }
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
