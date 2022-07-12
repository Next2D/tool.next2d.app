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
        super();

        this._$defaultCommand = null;
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
        this.add("+", this.addLayer);

        // レイヤの削除コマンド
        this.add("Backspace", this.removeController);

        // レイヤーの上下移動
        this.add("ArrowDown", this.selectLayer);
        this.add("ArrowUp", this.selectLayer);

        // タイムラインの左右移動
        this.add("ArrowLeft", this.moveFrame);
        this.add("ArrowRight", this.moveFrame);

        // フレーム追加コマンド
        this.add("f", this.frameController);

        // ラベルへのフォーカス
        this.add("l", this.focusLabel);

        // 空のキーフレームを追加
        this.add("e", this.addEmptyKey);

        // キーフレームの追加・削除
        this.add("k", this.keyFrameController);

        // JavaScriptのモーダルを起動
        this.add("s", this.openScriptModal);

        // 選択肢たフレームのDisplayObjectのプロパティーに切り替え
        this.add("v", this.activePropertyTab);
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
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

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
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        Util.$javaScriptEditor.show();
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
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        document.getElementById("label-name").focus();
    }

    /**
     * @description 指定フレームにフレームを追加、Ctrlキー押下中はフレームを削除
     *
     * @return {void}
     * @method
     * @public
     */
    frameController ()
    {
        if (Util.$ctrlKey) {

            Util.$timelineTool.executeTimelineFrameDelete();

        } else {

            Util.$timelineTool.executeTimelineFrameAdd();

        }
    }

    /**
     * @description 左右キーでフレームを移動
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveFrame (event)
    {
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const index = event.key === "ArrowRight" ? 1 : -1;

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
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    selectLayer (event)
    {
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        let element = null;

        const parent = document
            .getElementById("timeline-content");

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {

            if (event.key === "ArrowDown") {

                element = parent.firstElementChild;
                parent.scrollTop = 0;

            } else {

                element = parent.lastElementChild;
                parent.scrollTop = parent.scrollHeight;

            }

        } else {

            if (event.key === "ArrowDown") {

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
     * @method
     * @public
     */
    removeController ()
    {
        if (Util.$ctrlKey) {

            Util.$timelineTool.executeTimelineLayerTrash();

        } else {

            Util.$timelineLayer.removeFrame();
        }
    }

    /**
     * @description 新規レイヤーを追加
     *
     * @method
     * @public
     */
    addLayer ()
    {
        if (!Util.$ctrlKey) {
            return ;
        }

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
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        Util.$timelineTool.executeTimelineEmptyAdd();
    }

    /**
     * @description 空のキーフレームを追加
     *
     * @method
     * @public
     */
    keyFrameController ()
    {
        if (Util.$ctrlKey) {

            Util.$timelineTool.executeTimelineKeyDelete();

        } else {

            Util.$timelineTool.executeTimelineKeyAdd();

        }
    }
}

Util.$timelineKeyboardCommand = new TimelineKeyboardCommand();
