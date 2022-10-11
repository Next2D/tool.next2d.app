/**
 * @class
 * @memberOf view.controller
 */
class TabController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        this._$active = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState !== "complete") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @description コントローラーのタブのイベント登録
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        const tabArea = document
            .getElementById("controller-tab-area");

        if (tabArea) {

            const tabs = tabArea.children;
            for (let idx = 0; idx < tabs.length; ++idx) {

                const tab = tabs[idx];

                // 一番左のタブを初期アクティブに設定
                if (!this._$active) {
                    tab.classList.add("active");
                    this._$active = tab;
                }

                tab.addEventListener("click", (event) =>
                {
                    this.mouseDown(event);
                });

            }
        }

        const controllerArea = document
            .getElementById("controller-area");

        if (controllerArea) {

            const nodes = controllerArea.children;
            for (let idx = 0; idx < nodes.length; ++idx) {

                const node = nodes[idx];
                if (idx) {
                    node.style.display = "none";
                }

            }
        }

        Util.$initializeEnd();
    }

    /**
     * @description 選択したタブをアクティブ表示する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        event.stopPropagation();
        Util.$endMenu();

        // アクティブになっているタブのcssを初期化
        this
            ._$active
            .classList
            .remove("active");

        this
            ._$active
            .classList
            .add("disable");

        // 選択したタブをアクティブに
        event
            .target
            .classList
            .remove("disable");

        event
            .target
            .classList
            .add("active");

        this._$active = event.target;

        // タブの対象となるDOMを表示してそれ以外を非表示
        const nodes = document
            .getElementById("controller-area")
            .children;

        for (let idx = 0; idx < nodes.length; ++idx) {

            const node = nodes[idx];

            if (node.id !== event.target.dataset.tabType) {
                node.style.display = "none";
                continue;
            }

            node.style.display = "";
        }

        if (event.target.dataset.tabType === "controller-area-property") {
            this.showController();
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    showController ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (activeElements.length !== 1) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        const target    = activeElements[0];

        const layer = scene.getLayer(
            target.dataset.layerId | 0
        );

        const character = layer.getCharacter(
            target.dataset.characterId | 0
        );

        character.showController();
    }
}

Util.$tabController = new TabController();
