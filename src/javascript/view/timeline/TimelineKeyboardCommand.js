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
        this.add("Semicolon", this.addLayer);

        // レイヤの削除コマンド
        this.add("Delete", this.remove);
        this.add("Backspace", this.remove);

        // レイヤーの上下移動
        this.add("ArrowDown", this.selectLayer);
        this.add("ArrowUp", this.selectLayer);

        // タイムラインの左右移動
        this.add("ArrowLeft", this.moveFrame);
        this.add("ArrowRight", this.moveFrame);

        // フレーム追加コマンド
        this.add("Space", this.addFrame);

        // ラベルへのフォーカス
        this.add("KeyL", this.focusLabel);
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
     * @description 指定フレームにフレームを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addFrame ()
    {
        if (Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        Util.$timelineTool.executeTimelineFrameAdd();
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

        const index = event.code === "ArrowRight" ? 1 : -1;

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

            if (event.code === "ArrowDown") {

                element = parent.firstElementChild;
                parent.scrollTop = 0;

            } else {

                element = parent.lastElementChild;
                parent.scrollTop = parent.scrollHeight;

            }

        } else {

            if (event.code === "ArrowDown") {

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
     * @description 選択中の新規レイヤーを削除、Shift押下時はフレームを削除
     *
     * @method
     * @public
     */
    remove ()
    {
        if (Util.$shiftKey) {
            Util.$timelineTool.executeTimelineFrameDelete();
        }

        if (Util.$ctrlKey) {
            Util.$timelineTool.executeTimelineLayerTrash();
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
}

Util.$timelineKeyboardCommand = new TimelineKeyboardCommand();
