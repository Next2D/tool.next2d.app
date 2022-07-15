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

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$targetElement = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deleteIcon = null;
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

        if (!this._$deleteIcon) {
            this._$deleteIcon = this.deleteIcon.bind(this);
        }

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

            element
                .addEventListener("mouseleave", () =>
                {
                    this.clearParams();
                    window.removeEventListener("keydown", this._$deleteIcon);
                });

            element
                .addEventListener("mouseover", () =>
                {
                    window.addEventListener("keydown", this._$deleteIcon);
                });
        }
    }

    /**
     * @description クラスで利用する変数を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearParams ()
    {
        this._$targetElement = null;
    }

    /**
     * @description タイムラインのヘッダーを生成
     *
     * @param  {boolean} [build=true]
     * @return {void}
     * @method
     * @public
     */
    create (build = false)
    {
        // 描画エリアのサイズをセット
        const element = document
            .getElementById("timeline-header");

        // シーン移動や初回起動の時は初期化
        if (build) {

            // 変数を初期化
            this.lastFrame = 0;
            this._$scrollX = 0;
            this.clearParams();

            // スクロール位置を初期化
            Util.$timelineMarker.move();
            Util.$timelineLayer.moveTimeLine(0);

            // remove all
            while (element.children.length) {
                element.children[0].remove();
            }
        }

        const header = document
            .getElementById("timeline-header");

        // 生成する範囲の補正幅
        const adjustmentWidth = build ? 0 : header.scrollWidth;

        const fps = document
            .getElementById("stage-fps")
            .value | 0;

        let frame = this.lastFrame + 1;
        let sec   = Math.max(1, (frame / 24 | 0) + 1);
        let limit = Math.ceil(window.parent.screen.width * 2.5
            + Util.$currentWorkSpace().scene.totalFrame
            * (TimelineTool.DEFAULT_TIMELINE_WIDTH + 1)// +1はborder solidの1px
        ) - adjustmentWidth;

        for (;;) {

            const htmlTag = `
<div class="frame-header-parent" data-frame="${frame}">
    <div class="frame-sec ${frame % 5 === 0 ? "frame-border-end" : "frame-border"}" data-frame="${frame}">${frame % fps === 0 && fps > 4 ? sec++ + "s" : ""}</div>
    <div id="frame-label-marker-${frame}" class="frame-border-box" data-type="marker" data-frame="${frame}"></div>
    <div id="frame-label-action-${frame}" class="frame-border-box" data-type="action" data-frame="${frame}"></div>
    <div id="frame-label-sound-${frame}" class="frame-border-box" data-type="sound" data-frame="${frame}"></div>
    <div class="frame-number" data-frame="${frame}">${frame % 5 === 0 ? frame : ""}</div>
</div>
`;
            // add child
            element.insertAdjacentHTML("beforeend", htmlTag);

            element
                .lastElementChild
                .addEventListener("mousedown", (event) =>
                {
                    this.moveMarker(event);
                });

            // アイコンにdrag/dropイベントを登録
            const icons = [
                "marker",
                "action",
                "sound"
            ];

            for (let idx = 0; idx < icons.length; ++idx) {

                const element = document
                    .getElementById(`frame-label-${icons[idx]}-${frame}`);

                if (!element) {
                    continue;
                }

                element.addEventListener("mousedown", (event) =>
                {
                    this.dragIcon(event);
                });

                element.addEventListener("dragover", (event) =>
                {
                    event.preventDefault();
                });

                element.addEventListener("drop", (event) =>
                {
                    this.dropIcon(event);
                });
            }

            // +1はborder solidの1px
            limit -= TimelineTool.DEFAULT_TIMELINE_WIDTH + 1;
            if (0 >= limit) {
                break;
            }

            if (limit > 0) {
                frame++;
            }
        }

        this.lastFrame = frame;
    }

    /**
     * @description ラベル・スクリプト・サウンドのアイコンを移動開始関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    dragIcon (event)
    {
        const target = event.target;
        if (target.classList.contains("frame-border-box")) {
            return ;
        }

        // 全てのイベントを中止
        event.stopPropagation();

        // setup
        target.draggable     = true;
        this._$targetElement = target;
    }

    /**
     * @description 指定したアイコンを削除する
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     */
    deleteIcon (event)
    {
        if (Util.$keyLock) {
            return ;
        }

        if (event.key !== "Backspace") {
            return ;
        }

        if (!this._$targetElement) {
            return ;
        }

        this.save();

        const frame = this._$targetElement.dataset.frame | 0;
        const scene = Util.$currentWorkSpace().scene;
        const type  = this._$targetElement.dataset.type;
        switch (type) {

            case "marker":
                scene.deleteLabel(frame);
                break;

            case "action":
                scene.deleteAction(frame);
                break;

            case "sound":
                scene.deleteSound(frame);
                break;

            default:
                break;

        }

        // スタイルの変更して初期化
        this
            ._$targetElement
            .setAttribute("class", "frame-border-box");

        this._$targetElement = null;

        // 初期化
        super.focusOut();
    }

    /**
     * @description ラベル・スクリプト・サウンドのアイコンを移動処理関数
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
     * @public
     */
    dropIcon (event)
    {
        if (!this._$targetElement) {
            return ;
        }

        event.preventDefault();
        this._$targetElement.draggable = false;

        const target = event.target;

        const dragFrame = this._$targetElement.dataset.frame | 0;
        const dropFrame = target.dataset.frame | 0;

        // フレームが異なれば処理を行う
        if (dragFrame !== dropFrame) {

            this.save();

            const scene = Util.$currentWorkSpace().scene;
            const type  = this._$targetElement.dataset.type;

            // 表示を追加
            const element = document
                .getElementById(`frame-label-${type}-${dropFrame}`);

            element
                .setAttribute("class", `frame-border-box-${type}`);

            switch (type) {

                case "marker":
                    scene.setLabel(dropFrame, scene.gerLabel(dragFrame));
                    break;

                case "action":
                    scene.setAction(dropFrame, scene.getAction(dragFrame));
                    break;

                case "sound":
                    scene.setSound(dropFrame, scene.getSound(dragFrame));
                    break;

                default:
                    break;

            }

            // 複製でない時は削除する
            if (!Util.$altKey) {
                this.deleteIcon({ "key": "Backspace" });
            }

            // 新しいアイコンのelementをセット
            this._$targetElement = element;
        }

        // 初期化
        super.focusOut();
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

        // 変数を初期化
        this.clearParams();

        // フレームを更新
        Util.$timelineFrame.currentFrame = event.target.dataset.frame | 0;

        // マーカーを移動
        Util.$timelineMarker.move();

        // 移動先の音声設定を生成
        Util.$soundController.createSoundElements();

        // マーカーの移動を有効化
        Util.$timelineMarker.startMarker();
    }
}

Util.$timelineHeader = new TimelineHeader();
