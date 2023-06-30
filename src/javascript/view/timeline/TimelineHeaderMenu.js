/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class TimelineHeaderMenu extends BaseTimeline
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

        const elementIds = [
            "context-menu-script-add-one",
            "context-menu-script-copy-all",
            "context-menu-script-copy",
            "context-menu-script-paste",
            "context-menu-label-copy-all",
            "context-menu-label-copy",
            "context-menu-label-paste",
            "context-menu-sound-copy-all",
            "context-menu-sound-copy",
            "context-menu-sound-paste"
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
}