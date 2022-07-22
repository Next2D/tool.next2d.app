/**
 * @class
 * @extends {KeyboardCommand}
 */
class TimelineKeyboardCommand extends KeyboardCommand
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("timeline");
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
        super.initialize();

        const element = document
            .getElementById("timeline");

        if (element) {

            element.addEventListener("mouseleave", () =>
            {
                this.active = false;
            });

            element.addEventListener("mouseover", () =>
            {
                if (!this.active) {
                    this.active = true;
                }
            });
        }

        // レイヤー追加コマンド
        this.add(
            Util.$generateShortcutKey("+", { "ctrl": true }),
            this.addLayer
        );
        this.add(
            Util.$generateShortcutKey(";", { "ctrl": true }),
            this.addLayer
        );

        // レイヤの削除コマンド
        this.add(
            Util.$generateShortcutKey("Backspace", { "ctrl": true }),
            this.deleteLayer
        );

        // フレームに設定されてるDisplayObjectを削除
        this.add("Backspace", this.removeFrameCharacter);

        // レイヤーの上下移動
        this.add("ArrowDown", this.selectLayer);
        this.add("ArrowUp", this.selectLayer);

        // タイムラインの左右移動
        this.add("ArrowLeft", this.moveFrame);
        this.add("ArrowRight", this.moveFrame);

        // フレーム追加コマンド
        this.add("f", this.addFrame);
        this.add(
            Util.$generateShortcutKey("f", { "ctrl": true }),
            this.deleteFrame
        );

        // キーフレーム追加コマンド
        this.add("k", this.addKeyFrame);
        this.add(
            Util.$generateShortcutKey("k", { "ctrl": true }),
            this.deleteKeyFrame
        );

        // ラベルへのフォーカス
        this.add("l", this.focusLabel);

        // 空のキーフレームを追加
        this.add("e", this.addEmptyKey);

        // JavaScriptのモーダルを起動
        this.add("s", this.openScriptModal);

        // 選択肢たフレームのDisplayObjectのプロパティーに切り替え
        this.add("v", this.activePropertyTab);

        // ズームへのフォーカス
        this.add("z", this.focusZoom);

        // レイヤの削除コマンド
        this.add(Util.$generateShortcutKey("h", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerLightAll();
        });

        this.add(Util.$generateShortcutKey("l", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerLockAll();
        });

        this.add(Util.$generateShortcutKey("d", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerDisableAll();
        });

        this.add(Util.$generateShortcutKey("n", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerNormal();
        });

        this.add(Util.$generateShortcutKey("m", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerMask();
        });

        this.add(Util.$generateShortcutKey("g", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerGuide();
        });
    }

    /**
     * @description 選択肢たフレームのDisplayObjectのプロパティーに切り替え
     *
     * @return {void}
     * @method
     * @public
     */
    activePropertyTab ()
    {
        // タブの切り替え
        document
            .getElementById("controller-tab-area")
            .children[0].click();
    }

    /**
     * @description JavaScriptのモーダルの起動
     *
     * @return {void}
     * @method
     * @public
     */
    openScriptModal ()
    {
        Util.$javaScriptEditor.show();
    }

    /**
     * @description ズームへフォーカス
     *
     * @return {void}
     * @method
     * @public
     */
    focusZoom ()
    {
        document.getElementById("timeline-scale").focus();
    }

    /**
     * @description ラベルへフォーカス
     *
     * @return {void}
     * @method
     * @public
     */
    focusLabel ()
    {
        document.getElementById("label-name").focus();
    }

    /**
     * @description 指定フレームにフレームを削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteFrame ()
    {
        Util.$timelineTool.executeTimelineFrameDelete();
    }

    /**
     * @description 指定フレームにフレームを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addFrame ()
    {
        Util.$timelineTool.executeTimelineFrameAdd();
    }

    /**
     * @description 左右キーでフレームを移動
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    moveFrame (code)
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const index = code
            ? code === "ArrowRight" ? 1 : -1
            : 0;

        const frame = Math.max(1, Math.min(
            Util.$timelineFrame.currentFrame + index,
            Util.$timelineHeader.lastFrame
        ));

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        // フレーム移動前にラベルの情報を更新する
        Util.$timelineLayer.changeLabel(frame); // fixed logic

        // フレーム移動
        Util.$timelineLayer.moveFrame(frame);
        Util.$timelineLayer.activeLayer(targetLayer);
        Util.$timelineMarker.moveVisibleLocation();
    }

    /**
     * @description 上下キーで選択レイヤーを操作
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    selectLayer (code)
    {
        let element = null;

        const parent = document
            .getElementById("timeline-content");

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {

            if (code === "ArrowDown") {

                element = parent.firstElementChild;
                parent.scrollTop = 0;

            } else {

                element = parent.lastElementChild;
                parent.scrollTop = parent.scrollHeight;

            }

        } else {

            if (code === "ArrowDown") {

                element = targetLayer.nextElementSibling;
                if (!element) {
                    return ;
                }

                if (element.offsetTop + element.offsetHeight
                    > window.innerHeight
                ) {
                    parent.scrollTop += element.offsetHeight;
                }

            } else {

                element = targetLayer.previousElementSibling;
                if (!element) {
                    return ;
                }

                if (parent.offsetTop + parent.scrollTop >= element.offsetTop) {
                    parent.scrollTop -= element.offsetHeight;
                }

            }

        }

        Util
            .$timelineLayer
            .activeLayer(element);
    }

    /**
     * @description 選択中のレイヤーを削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteLayer ()
    {
        Util.$timelineTool.executeTimelineLayerTrash();
    }

    /**
     * @description 選択中のフレームに設定されてるDisplayObjectを削除
     *
     * @method
     * @public
     */
    removeFrameCharacter ()
    {
        Util.$timelineLayer.removeFrame();
    }

    /**
     * @description 新規レイヤーを追加
     *
     * @method
     * @public
     */
    addLayer ()
    {
        Util.$timelineTool.executeTimelineLayerAdd();
    }

    /**
     * @description 空のキーフレームを追加
     *
     * @method
     * @public
     */
    addEmptyKey ()
    {
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

    /**
     * @description キーフレームを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addKeyFrame ()
    {
        Util.$timelineTool.executeTimelineKeyAdd();
    }

    /**
     * @description キーフレームを削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteKeyFrame ()
    {
        Util.$timelineTool.executeTimelineKeyDelete();
    }
}

Util.$timelineKeyboardCommand = new TimelineKeyboardCommand();
