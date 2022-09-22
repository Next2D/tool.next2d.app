/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
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
            "timeline-layer-guide",
            "timeline-layer-copy",
            "timeline-layer-paste"
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
            });
        }

        // レイヤーカラー変更のイベント登録
        const element = document.getElementById("timeline-layer-color");
        if (element) {
            element.addEventListener("change", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.changeLayerHighlightColor(event);
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
        // 表示モーダルを全て終了
        Util.$endMenu();

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const scene   = Util.$currentWorkSpace().scene;
        const layerId = targetLayer.dataset.layerId | 0;

        const layer = scene.getLayer(layerId);
        if (layer.mode === LayerMode.NORMAL) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = LayerMode.NORMAL;
        layer.showIcon();

        if (reload) {
            this.reloadScreen();
        }

        // 初期化
        super.focusOut();
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
        // 表示モーダルを全て終了
        Util.$endMenu();

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

        if (layer.mode === LayerMode.MASK) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = LayerMode.MASK;
        layer.showIcon();

        if (reload || layer.lock) {
            this.reloadScreen();
        }

        // 初期化
        super.focusOut();
    }

    /**
     * @description 指定したレイヤーをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerCopy ()
    {
        // 表示モーダルを全て終了
        Util.$endMenu();

        Util.$timelineMenu.executeContextMenuLayerCopy();
    }

    /**
     * @description 指定したレイヤーの上部にコピーした情報を貼り付け
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerPaste ()
    {
        // 表示モーダルを全て終了
        Util.$endMenu();

        Util.$timelineMenu.executeContextMenuLayerPaste();
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
        // 表示モーダルを全て終了
        Util.$endMenu();

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

        if (layer.mode === LayerMode.GUIDE) {
            return ;
        }

        // 状態を保存
        this.save();

        const reload = this.resetLayer(targetLayer);

        layer.mode = LayerMode.GUIDE;
        layer.showIcon();

        if (reload) {
            this.reloadScreen();
        }

        // 初期化
        super.focusOut();
    }

    /**
     * @description レイヤーのハイライトカラーの変更処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    changeLayerHighlightColor (event)
    {
        this.save();

        const layerId = event.target.dataset.layerId | 0;
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layerId);

        // レイヤーオブジェクトを更新
        layer.color = event.target.value;

        const lightIcon = document
            .getElementById(`layer-light-icon-${layerId}`);

        lightIcon
            .style
            .backgroundImage = `url('${layer.getHighlightURL()}')`;

        if (layer.light) {
            document
                .getElementById(`layer-id-${layerId}`)
                .style
                .borderBottom = `1px solid ${layer.color}`;
        }

        // 初期化
        super.focusOut();

        // モーダルも終了
        Util.$endMenu();
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

            case LayerMode.MASK:
                for (;;) {
                    const node = children[++index];
                    if (!node) {
                        break;
                    }

                    const layer = scene.getLayer(node.dataset.layerId | 0);
                    if (layer.mode !== LayerMode.MASK_IN) {
                        break;
                    }

                    layer.maskId = null;
                    layer.mode   = LayerMode.NORMAL;
                    layer.showIcon();

                    reload = true;
                }
                break;

            case LayerMode.GUIDE:
                for (;;) {
                    const node = children[++index];
                    if (!node) {
                        break;
                    }

                    const layer = scene.getLayer(node.dataset.layerId | 0);
                    if (layer.mode !== LayerMode.GUIDE_IN) {
                        break;
                    }

                    layer.guideId = null;
                    layer.mode    = LayerMode.NORMAL;
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

        const layerId = event.target.dataset.layerId | 0;
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layerId);

        const input = document
            .getElementById("timeline-layer-color");

        input.dataset.layerId = `${layerId}`;
        input.value = layer.color;

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
