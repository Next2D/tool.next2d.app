/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineMenu extends BaseTimeline
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
            "context-menu-script-add",
            "context-menu-frame-add",
            "context-menu-key-frame-add",
            "context-menu-empty-key-frame-add",
            "context-menu-frame-delete",
            "context-menu-key-frame-delete",
            "context-menu-tween-add",
            "context-menu-tween-delete",
            "context-menu-frame-copy",
            "context-menu-frame-paste"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                this.executeFunction(event);
            });
        }
    }

    /**
     * @description JavaScript編集モーダルを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptAdd ()
    {
        Util.$javaScriptEditor.show();
    }

    /**
     * @description タイムラインにフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFrameAdd ()
    {
        Util.$timelineTool.executeTimelineFrameAdd();
    }

    /**
     * @description タイムラインにキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuKeyFrameAdd ()
    {
        Util.$timelineTool.executeTimelineKeyAdd();
    }

    /**
     * @description タイムラインにキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuKeyFrameDelete ()
    {
        Util.$timelineTool.executeTimelineKeyDelete();
    }

    /**
     * @description タイムラインに空のキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuEmptyKeyFrameAdd ()
    {
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

    /**
     * @description タイムラインのフレームを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFrameDelete ()
    {
        Util.$timelineTool.executeTimelineFrameDelete();
    }

    /**
     * @description 指定のレイヤーにtweenを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenAdd ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length) {
            return ;
        }

        if (characters.length > 1) {
            alert(
                "If you want to add motion tweening to multiple objects, please do so in a single MovieClip."
            );
            return ;
        }

        /**
         * @param {Character}
         */
        const character = characters[0];
        const range = character.getRange(frame);

        // すでに、tweenの設定があればスキップ
        if (character.hasTween(range.startFrame)) {
            return ;
        }

        this.save();

        character.setTween(range.startFrame, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject()
        });

        const place = character.getPlace(range.startFrame);
        place.tweenRange = {
            "startFrame": range.startFrame,
            "endFrame": range.endFrame
        };

        // tweenのポインターを配置
        Util
            .$tweenController
            .clearPointer()
            .relocationPointer();

        // タイムラインを再描画
        layer.reloadStyle();

        // 再描画
        character._$image = null;
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description 指定のレイヤーのtweenを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenDelete ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length || characters.length > 1) {
            return ;
        }

        /**
         * @param {Character}
         */
        const character = characters[0];
        const range = character.getRange(frame);

        // tweenの設定がなければスキップ
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        this.save();

        // tweenで作成したplace objectを削除
        for (let frame = range.startFrame + 1; range.endFrame > frame; ++frame) {
            if (!character.hasPlace(frame)) {
                continue;
            }
            character.deletePlace(frame);
        }

        // tweenのマスタを削除
        character.deleteTween(range.startFrame);

        const place = character.getPlace(range.startFrame);
        delete place.tweenRange;

        // tweenのポインターを削除
        Util
            .$tweenController
            .clearPointer();

        // タイムラインを再描画
        layer.reloadStyle();

        // 再描画
        character._$image = null;
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description タイムラインのメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        Util.$endMenu("timeline-menu");

        const element = document.getElementById("timeline-menu");

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

Util.$timelineMenu = new TimelineMenu();
