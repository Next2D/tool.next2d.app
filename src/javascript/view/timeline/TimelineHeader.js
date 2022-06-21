/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineHeader extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @description 1
         * @private
         */
        this._$lastFrame = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;
    }

    /**
     * @description ヘッダータイムラインのスクロールx座標
     *
     * @return {number}
     * @public
     */
    get scrollX ()
    {
        return this._$scrollX;
    }

    /**
     * @description ヘッダータイムラインのスクロールx座標
     *
     * @param  {number} scroll_x
     * @return {void}
     * @public
     */
    set scrollX (scroll_x)
    {
        this._$scrollX = scroll_x | 0;
    }

    /**
     * @description 現在のタイムラインの最後のフレーム番号を返す
     *
     * @return {number}
     * @public
     */
    get lastFrame ()
    {
        return this._$lastFrame;
    }

    /**
     * @description 現在のタイムラインの最後のフレーム番号を返す
     *
     * @param  {number} last_frame
     * @return {void}
     * @public
     */
    set lastFrame (last_frame)
    {
        this._$lastFrame = last_frame | 0;
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

        // 上部のタイムラインの動作イベント
        const element = document
            .getElementById("timeline-controller-base");

        if (element) {
            element.addEventListener("wheel", (event) =>
            {
                // 全てのイベントを停止
                event.stopPropagation();
                event.preventDefault();

                if (Util.$ctrlKey) {

                    const deltaY = event.deltaY | 0;
                    if (!deltaY) {
                        return false;
                    }

                    // タイムラインの幅をスケール
                    Util.$timelineTool.timelineWidth = Util.$clamp(
                        Util.$timelineTool.timelineWidth + deltaY,
                        5,
                        240
                    );

                } else {

                    const delta = (event.deltaX || event.deltaY) | 0;
                    if (!delta) {
                        return false;
                    }

                    const maxDeltaX = event.currentTarget.scrollWidth
                        - event.currentTarget.offsetWidth;

                    this._$scrollX = Util.$clamp(
                        this._$scrollX + delta, 0, maxDeltaX
                    );

                    Util
                        .$timelineLayer
                        .moveTimeLine(this._$scrollX);

                }

            }, { "passive" : false });
        }
    }

    /**
     * @description タイムラインのヘッダーを生成
     *
     * @return {void}
     * @method
     * @public
     */
    build ()
    {
        // 描画エリアのサイズをセット
        const element = document
            .getElementById("timeline-header");

        // remove all
        while (element.children.length) {
            element.children[0].remove();
        }

        const fps = document
            .getElementById("stage-fps")
            .value | 0;

        let sec   = 1;
        let frame = 1;
        let limit = Math.ceil(window.parent.screen.width * 2
            + Util.$currentWorkSpace().scene.totalFrame * 13
        );

        while (limit > 0) {

            const htmlTag = `
<div class="frame-header-parent" data-frame="${frame}">
    <div class="${frame % 5 === 0 ? "frame-border-end" : "frame-border"}" data-frame="${frame}">${frame % fps === 0 && fps > 4 ? sec++ + "s" : ""}</div>
    <div id="frame-label-marker-${frame}" class="frame-border-box" data-frame="${frame}"></div>
    <div id="frame-label-action-${frame}" class="frame-border-box" data-frame="${frame}"></div>
    <div id="frame-label-sound-${frame}"  class="frame-border-box" data-frame="${frame}"></div>
    <div class="frame-number" data-frame="${frame}">${frame % 5 === 0 ? frame : ""}</div>
</div>
`;
            frame++;

            // add child
            element.insertAdjacentHTML("beforeend", htmlTag);

            element
                .lastElementChild
                .addEventListener("mousedown", (event) =>
                {
                    this.moveMarker(event);
                });

            limit -= 13;

        }

        this.lastFrame = frame;
    }

    /**
     * @description ヘッダーのフレーム枠をマウスダウンした時の処置
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    moveMarker (event)
    {
        // 全てのイベント停止
        event.stopPropagation();

        Util.$timelineFrame.currentFrame = event.target.dataset.frame | 0;
        Util.$timelineMarker.move();
        Util.$timelineMarker.startMarker();
    }
}

Util.$timelineHeader = new TimelineHeader();
