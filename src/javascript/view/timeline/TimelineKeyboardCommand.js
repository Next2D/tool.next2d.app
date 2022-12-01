/**
 * @class
 * @extends {KeyboardCommand}
 * @memberOf view.timeline
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

            element.addEventListener("mouseup", () =>
            {
                if (!this.active) {
                    this.active = true;
                }
            });
        }

        // レイヤー追加コマンド
        this.add(Util.$generateShortcutKey("+", { "ctrl": true }), () =>
        {
            Util.$timelineTool.executeTimelineLayerAdd();
        });
        this.add(Util.$generateShortcutKey(";", { "ctrl": true }), () =>
        {
            Util.$timelineTool.executeTimelineLayerAdd();
        });

        // レイヤの削除コマンド
        this.add(Util.$generateShortcutKey("Backspace", { "ctrl": true }), () =>
        {
            Util.$timelineTool.executeTimelineLayerTrash();
        });

        // フレームに設定されてるDisplayObjectを削除
        this.add("Backspace", () =>
        {
            Util.$timelineLayer.removeFrame();
        });

        // レイヤーの上下移動
        this.add("ArrowDown", this.selectLayer);
        this.add("ArrowUp", this.selectLayer);

        // タイムラインの左右移動
        this.add("ArrowLeft", this.moveFrame);
        this.add("ArrowRight", this.moveFrame);

        // フレーム追加コマンド
        this.add("f", () =>
        {
            Util.$timelineTool.executeTimelineFrameAdd();
        });
        this.add(Util.$generateShortcutKey("f", { "ctrl": true }), () =>
        {
            Util.$timelineTool.executeTimelineFrameDelete();
        });

        // キーフレーム追加コマンド
        this.add("k", () =>
        {
            Util.$timelineTool.executeTimelineKeyAdd();
        });
        this.add(Util.$generateShortcutKey("k", { "ctrl": true }), () =>
        {
            Util.$timelineTool.executeTimelineKeyDelete();
        });

        // ラベルへのフォーカス
        this.add("l", () =>
        {
            document.getElementById("label-name").focus();
        });

        // 空のキーフレームを追加
        this.add("e", () =>
        {
            Util.$timelineTool.executeTimelineEmptyAdd();
        });

        // JavaScriptのモーダルを起動
        this.add("s", () =>
        {
            Util.$javaScriptEditor.show();
        });

        // 選択肢たフレームのDisplayObjectのプロパティーに切り替え
        this.add("v", this.activePropertyTab);

        // ズームへのフォーカス
        this.add("z", () =>
        {
            document.getElementById("timeline-scale").focus();
        });

        // プレビュー機能のOn/Off
        this.add("p", Util.$timelineTool.executeTimelinePreview);

        // オニオンスキンを起動
        this.add("o", () => {
            Util
                .$timelineTool
                .executeTimelineOnionSkin();
        });

        // tweenを起動
        this.add("m", () =>
        {
            Util
                .$timelineMenu
                .executeContextMenuTweenAdd();
        });

        // tweenを削除
        this.add(Util.$generateShortcutKey("m", { "ctrl": true }), () =>
        {
            Util
                .$timelineMenu
                .executeContextMenuTweenDelete();
        });

        // レイヤの削除コマンド
        this.add(Util.$generateShortcutKey("h", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerLightAll();
        });

        // レイヤー全てをロック
        this.add(Util.$generateShortcutKey("l", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerLockAll();
        });

        // レイヤー全てを非表示に
        this.add(Util.$generateShortcutKey("d", { "shift": true }), () =>
        {
            Util
                .$timelineTool
                .executeTimelineLayerDisableAll();
        });

        // レイヤーをノーマルモードに
        this.add(Util.$generateShortcutKey("n", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerNormal();
        });

        // レイヤーをマスクモードに
        this.add(Util.$generateShortcutKey("m", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerMask();
        });

        // レイヤーをガイドモードに
        this.add(Util.$generateShortcutKey("g", { "shift": true }), () =>
        {
            Util
                .$timelineLayerMenu
                .executeTimelineLayerGuide();
        });

        // 選択中のDisplayObjectをコピー
        this.add(Util.$generateShortcutKey("c", { "ctrl": true }), () =>
        {
            Util.$screenMenu.copyDisplayObject();
            return false;
        });

        // コピーしたDisplayObjectをペースト
        this.add(Util.$generateShortcutKey("v", { "ctrl": true }), () =>
        {
            Util.$screenMenu.pasteDisplayObject();
            return false;
        });

        // コピーしたDisplayObjectをペースト
        this.add(Util.$generateShortcutKey("l", { "ctrl": true }), () =>
        {
            Util.$timelineMenu.executeContextMenuLayerCopy();
            Util.$timelineMenu.executeContextMenuLayerPaste();
        });

        // フレーム1に移動
        this.add(Util.$generateShortcutKey("ArrowLeft", { "ctrl": true }), () =>
        {
            Util.$timelineMenu.executeContextMenuFirstFrame();
        });

        // 最終フレームに移動
        this.add(Util.$generateShortcutKey("ArrowRight", { "ctrl": true }), () =>
        {
            Util.$timelineMenu.executeContextMenuLastFrame();
        });

        // キーフレームに変換
        this.add("F6", () =>
        {
            Util.$timelineMenu.executeContextMenuKeyFrameChange();
        });

        // 空のキーフレームに変換
        this.add("F7", () =>
        {
            Util.$timelineMenu.executeContextMenuKeyFrameChange();
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

        const frame = Math.max(1, Util.$timelineFrame.currentFrame + index);

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

                // 一番上のレイヤーを選択
                element = parent.firstElementChild;
                Util.$timelineScroll.execute(
                    0,
                    -Util.$timelineScroll.y
                );

            } else {

                // 一番下のレイヤーを選択
                element = parent.lastElementChild;
                Util.$timelineScroll.execute(
                    0,
                    Util.$timelineLayer.clientHeight
                );

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
                    Util.$timelineScroll.execute(
                        0,
                        Util.$timelineTool.timelineHeight
                    );
                }

            } else {

                element = targetLayer.previousElementSibling;
                if (!element) {
                    return ;
                }

                if (parent.offsetTop > element.offsetTop) {
                    Util.$timelineScroll.execute(
                        0,
                        -Util.$timelineTool.timelineHeight
                    );
                }

            }

        }

        Util
            .$timelineLayer
            .activeLayer(element);
    }
}

Util.$timelineKeyboardCommand = new TimelineKeyboardCommand();
