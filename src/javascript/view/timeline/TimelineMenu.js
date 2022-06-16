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
            "context-menu-frame-delete"
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
        Util.$timeline.addSpaceFrame();
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
        Util.$timeline.addKeyFrame();
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
        Util.$timeline.addEmptyFrame();
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
        Util.$timeline.deleteFrame();
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
