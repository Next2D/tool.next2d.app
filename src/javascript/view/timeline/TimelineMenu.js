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
            "context-menu-frame-key-frame-delete",
            "context-menu-tween-add",
            "context-menu-tween-delete"
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

                // メニューを非表示
                Util.$endMenu();
            });
        }
    }

    /**
     * @description JavaScript編集モーダルを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptAdd (event)
    {
        Util.$javaScriptEditor.show(event);
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
     * TODO
     * @description 指定のレイヤーにtweenを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenAdd ()
    {
        Util.$endMenu();

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const scene = Util.$currentWorkSpace().scene;

        const layerElement = this._$targetLayer;
        const layerId = layerElement.dataset.layerId | 0;

        const layer = scene.getLayer(layerId);

        const frame = Util.$timelineFrame.currentFrame;

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

        let endFrame = frame;
        for (;;) {

            ++endFrame;

            const element = document
                .getElementById(`${layerId}-${endFrame}`);

            if (element.dataset.frameState === "empty") {
                --endFrame;
                break;
            }

            if (element.classList.contains("key-frame")
                || element.classList.contains("empty-key-frame")
            ) {
                --endFrame;
                break;
            }

            if (element.classList.contains("key-space-frame-end")) {
                break;
            }
        }

        let startFrame = frame;
        while (startFrame > 0) {

            const element = document
                .getElementById(`${layerId}-${startFrame}`);

            if (element.classList.contains("key-frame")) {
                break;
            }

            --startFrame;
        }

        const startElement = document
            .getElementById(`${layerId}-${startFrame}`);

        if (startElement.classList.contains("tween-key-frame")) {
            return ;
        }

        Util
            .$currentWorkSpace()
            .temporarilySaved();

        startElement.classList.add("tween-key-frame");

        let tweenEndFrame = startFrame;
        const character = characters[0];
        for (; endFrame >= tweenEndFrame; ++tweenEndFrame) {

            const element = document
                .getElementById(`${layerId}-${tweenEndFrame}`);

            if (element.classList.contains("frame-active")) {
                element.classList.remove("frame-active");
            }

            if (!element.classList.contains("tween-frame")) {
                element.classList.add("tween-frame");

                layer
                    ._$frame
                    .getClasses(tweenEndFrame)
                    .push("tween-frame");

            }

            if (tweenEndFrame > startFrame) {
                const clone = character.clonePlace(startFrame, tweenEndFrame);
                if (clone.loop) {
                    clone.loop.referenceFrame = startFrame;
                    clone.loop.tweenFrame     = tweenEndFrame + 1;
                }
                character.setPlace(tweenEndFrame, clone);
            }

            if (element.classList.contains("key-space-frame-end")) {
                break;
            }
        }

        const startPlace = character.getPlace(startFrame);
        if (startPlace.loop) {
            startPlace.loop.tweenFrame = startFrame + 1;
        }

        const endPlace = character.getPlace(tweenEndFrame);
        if (endPlace.loop) {
            endPlace.loop.tweenFrame = startFrame;
        }

        layer
            ._$frame
            .getClasses(startFrame)
            .push("tween-key-frame");

        const endElement = document
            .getElementById(`${layerId}-${endFrame}`);

        endElement.classList.add("tween-frame-end");

        layer
            ._$frame
            .getClasses(endFrame)
            .push("tween-frame-end");

        character._$image = null;
    }

    /**
     * TODO
     * @description 指定のレイヤーのtweenを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenDelete ()
    {
        Util.$endMenu();

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const scene = Util.$currentWorkSpace().scene;

        const layerElement = this._$targetLayer;
        const layerId = layerElement.dataset.layerId | 0;

        const layer = scene.getLayer(layerId);

        const frame = Util.$timelineFrame.currentFrame;

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length) {
            return ;
        }

        Util
            .$currentWorkSpace()
            .temporarilySaved();

        let startFrame = Util.$timelineFrame.currentFrame;

        while (startFrame > 0) {

            const element = document
                .getElementById(`${layerId}-${startFrame}`);

            if (element.classList.contains("key-frame")) {
                break;
            }

            --startFrame;
        }

        const character = characters[0];
        const endFrame  = character.endFrame - 1;
        for (let frame = startFrame; endFrame >= frame; ++frame) {

            const element = document
                .getElementById(`${layerId}-${frame}`);

            if (element.classList.contains("frame-active")) {
                element.classList.remove("frame-active");
            }

            if (!element.classList.contains("tween-frame")) {
                continue;
            }
            if (frame !== startFrame
                && element.classList.contains("ket-frame")
            ) {
                break;
            }

            element
                .classList
                .remove(
                    "tween-frame",
                    "tween-key-frame",
                    "tween-frame-end"
                );

            let classes = layer
                ._$frame
                .getClasses(frame);

            const names = [
                "tween-frame",
                "tween-key-frame",
                "tween-frame-end"
            ];
            for (let idx = 0; names.length > idx; ++idx) {
                const index = classes.indexOf(names[idx]);
                if (index === -1) {
                    continue;
                }
                classes.splice(index, 1);
            }

            layer
                ._$frame
                .setClasses(frame, classes);

            if (frame > startFrame) {
                character.deletePlace(frame);
            }

            if (element.classList.contains("key-space-frame-end")) {
                break;
            }
        }

        const startPlace = character.getPlace(startFrame);
        if (startPlace.loop) {
            delete startPlace.loop.tweenFrame;
        }

        character._$image = null;

        character._$tween.delete(startFrame);

        document
            .getElementById("ease-select")[0]
            .selected = true;

        Util.$controller.hideEaseCanvasArea();
        Util.$screen.clearTweenMarker();

        scene.changeFrame(frame);
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
