/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
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
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentFrame = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentFps = 0;

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
     * @description ヘッダーフレームのマーカーアイコンのindex番号
     *
     * @member {number}
     * @static
     * @const
     */
    static get MARKER_INDEX ()
    {
        return 1;
    }

    /**
     * @description ヘッダーフレームのスクリプトアイコンのindex番号
     *
     * @member {number}
     * @static
     * @const
     */
    static get ACTION_INDEX ()
    {
        return 2;
    }

    /**
     * @description ヘッダーフレームのサウンドアイコンのindex番号
     *
     * @member {number}
     * @static
     * @const
     */
    static get SOUND_INDEX ()
    {
        return 3;
    }

    /**
     * @description ヘッダーのclientWidthを格納
     *
     * @member {number}
     * @readonly
     * @public
     */
    get width ()
    {
        return this._$width;
    }

    /**
     * @description ヘッダータイムラインのスクロールx座標
     *
     * @return {number}
     * @readonly
     * @public
     */
    get scrollX ()
    {
        return this._$scrollX;
    }

    /**
     * @description 画面左端のフレーム番号を返す
     *
     * @return {number}
     * @readonly
     * @public
     */
    get leftFrame ()
    {
        if (!Util.$timelineTool.timelineWidth) {
            Util.$timelineTool.timelineWidth =
                Util.$timelineTool.DEFAULT_TIMELINE_WIDTH;
        }

        return 1 + this._$scrollX / Util.$timelineTool.timelineWidth | 0;
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
        this._$scrollX = Math.max(scroll_x, 0) | 0;
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

                if (Util.$altKey) {

                    const deltaY = event.deltaY | 0;
                    if (!deltaY) {
                        return false;
                    }

                    // タイムラインの幅をスケール
                    window.requestAnimationFrame(() =>
                    {
                        Util.$timelineTool.timelineWidth = Util.$clamp(
                            Util.$timelineTool.timelineWidth + deltaY,
                            5,
                            240
                        );
                    });

                } else {

                    const delta = (event.deltaX || event.deltaY) | 0;
                    if (!delta) {
                        return false;
                    }

                    // 1フレーム目より以前には移動しない
                    if (!this._$scrollX && 0 > delta) {
                        return false;
                    }

                    // 最大値より右側には移動しない
                    if (this._$scrollX >= Number.MAX_VALUE) {
                        return false;
                    }

                    window.requestAnimationFrame(() =>
                    {
                        this._$scrollX = Util.$clamp(
                            this._$scrollX + delta, 0, Number.MAX_VALUE
                        );

                        // ヘッダーを再構築
                        this.rebuild();

                        // マーカーを移動
                        Util.$timelineMarker.move();

                        // レイヤーのタイムラインを再描画
                        Util.$timelineLayer.moveTimeLine();
                    });
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
     * @description ヘッダーの表示幅の値をセット
     *
     * @return {void}
     * @method
     * @public
     */
    setWidth ()
    {
        const element = document.getElementById("timeline-controller-base");
        if (element) {
            this._$width = element.clientWidth | 0;
        }
    }

    /**
     * @description 現在の画面サイズに合わせてヘッダーのDOMを再構成
     *
     * @return {void}
     * @method
     * @public
     */
    rebuild ()
    {
        // 描画エリアのサイズをセット
        const element = document
            .getElementById("timeline-header");

        if (!element) {
            return ;
        }

        // 初期値をセット
        if (!Util.$timelineTool.timelineWidth) {
            Util.$timelineTool.timelineWidth =
                Util.$timelineTool.DEFAULT_TIMELINE_WIDTH;
        }

        const timelineWidth = Util.$timelineTool.timelineWidth;
        const elementCount  = this.width / (timelineWidth + 1) | 0;

        // elementが空なら初期処理を実行
        if (!element.children.length) {
            for (let idx = 0; elementCount >= idx; ++idx) {
                this.createElement(element, idx + 1);
            }
        }

        // 画面幅以上にelement数があれば削除
        if (element.children.length + 1 > elementCount) {
            const index = elementCount + 1;
            while (element.children.length > index) {
                element.children[index].remove();
            }
        }

        // 画面幅のelement数が多ければ再登録
        if (elementCount > element.children.length) {

            let frame = element
                .lastElementChild
                .dataset
                .frame | 0;

            const length = elementCount - element.children.length;
            for (let idx = 1; length >= idx; ++idx) {
                this.createElement(element, frame++);
            }
        }

        const fps = document
            .getElementById("stage-fps")
            .value | 0;

        let frame = this.leftFrame;
        if (this._$currentFrame === frame && this._$currentFps === fps) {
            return ;
        }
        this._$currentFrame = frame;
        this._$currentFps   = fps;

        let sec     = Math.max(1, (frame / 24 | 0) + 1);
        const scene = Util.$currentWorkSpace().scene;
        for (let idx = 0; element.children.length > idx; ++idx) {

            const currentFrame = frame + idx;

            const node = element.children[idx];
            node.dataset.frame = `${currentFrame}`;

            const nodeLength = node.children.length;
            for (let idx = 0; nodeLength > idx; ++idx) {

                const child = node.children[idx];
                child.dataset.frame = `${currentFrame}`;

                switch (idx) {

                    case 0:
                        child.setAttribute("class",  currentFrame % 5 === 0
                            ? "frame-border-end"
                            : "frame-border"
                        );

                        child.textContent = currentFrame % fps === 0 && fps > 4
                            ? sec++ + "s"
                            : "";
                        break;

                    // label
                    case TimelineHeader.MARKER_INDEX:
                        if (scene.hasLabel(currentFrame)) {
                            if (!child.classList.contains("frame-border-box-marker")) {
                                child.setAttribute("class", "frame-border-box-marker");
                            }
                        } else {
                            if (!child.classList.contains("frame-border-box")) {
                                child.setAttribute("class", "frame-border-box");
                            }
                        }
                        break;

                    // script
                    case TimelineHeader.ACTION_INDEX:
                        if (scene.hasAction(currentFrame)) {
                            if (!child.classList.contains("frame-border-box-action")) {
                                child.setAttribute("class", "frame-border-box-action");
                            }
                        } else {
                            if (!child.classList.contains("frame-border-box")) {
                                child.setAttribute("class", "frame-border-box");
                            }
                        }
                        break;

                    // sound
                    case TimelineHeader.SOUND_INDEX:
                        if (scene.hasSound(currentFrame)) {
                            if (!child.classList.contains("frame-border-box-sound")) {
                                child.setAttribute("class", "frame-border-box-sound");
                            }
                        } else {
                            if (!child.classList.contains("frame-border-box")) {
                                child.setAttribute("class", "frame-border-box");
                            }
                        }
                        break;

                    case 4:
                        if (currentFrame % 5 === 0) {

                            child.textContent = `${currentFrame}`;

                        } else {
                            if (child.textContent) {
                                child.textContent = "";
                            }
                        }
                        break;

                    default:
                        break;

                }
            }
        }
    }

    /**
     * @description ヘッダーelementを生成
     *
     * @param  {HTMLDivElement} parent
     * @param  {number} [frame=1]
     * @return {void}
     * @method
     * @public
     */
    createElement (parent, frame = 1)
    {
        const htmlTag = `
<div class="frame-header-parent" data-frame="${frame}">
    <div class="frame-sec ${frame % 5 === 0 ? "frame-border-end" : "frame-border"}" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="marker" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="action" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="sound" data-frame="${frame}"></div>
    <div class="frame-number" data-frame="${frame}">${frame % 5 === 0 ? frame : ""}</div>
</div>
`;
        parent.insertAdjacentHTML("beforeend", htmlTag);

        const element = parent.lastElementChild;
        element.addEventListener("mousedown", (event) =>
        {
            if (event.button) {
                return ;
            }
            this.moveMarker(event);
        });

        // アイコンにdrag/dropイベントを登録
        for (let idx = 0; idx < 3; ++idx) {

            const child = element.children[1 + idx];
            if (!child) {
                continue;
            }

            child.addEventListener("mousedown", (event) =>
            {
                this.dragIcon(event);
            });

            child.addEventListener("dragover", (event) =>
            {
                event.preventDefault();
            });

            child.addEventListener("drop", (event) =>
            {
                this.dropIcon(event);
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
            let targetElement = null;
            const parent = target.parentElement;
            switch (type) {

                case "marker":
                    targetElement = parent.children[1];
                    scene.setLabel(dropFrame, scene.getLabel(dragFrame));
                    break;

                case "action":
                    targetElement = parent.children[2];
                    scene.setAction(dropFrame, scene.getAction(dragFrame));
                    break;

                case "sound":
                    targetElement = parent.children[3];
                    scene.setSound(dropFrame, scene.getSound(dragFrame));
                    break;

                default:
                    break;

            }

            // 複製でない時は削除する
            if (!Util.$altKey) {
                this.deleteIcon({ "key": "Backspace" });
            }

            if (targetElement) {
                this._$targetElement = targetElement;
                targetElement
                    .setAttribute("class", `frame-border-box-${type}`);
            }
        }

        // 初期化
        super.focusOut();
    }

    /**
     * @description ヘッダーのフレーム枠をマウスダウンした時の処置
     *
     * @param  {Event} event
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

        // 再描画
        this.reloadScreen();
    }
}

Util.$timelineHeader = new TimelineHeader();
