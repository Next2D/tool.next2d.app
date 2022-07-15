/**
 * @class
 */
class ScreenTab
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$dropTab = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;
    }

    /**
     * @description タブエリアの起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    run ()
    {
        // 読込がWorkSpaceがあればタブのElementを追加
        for (let idx = 0; idx < Util.$workSpaces.length; ++idx) {
            this.createElement(Util.$workSpaces[idx], idx);
        }

        // タブの追加ボタン
        const button = document
            .getElementById("view-tab-add");

        if (button) {
            button.addEventListener("click", (event) =>
            {
                this.addTab(event);
            });
        }

        // タブの一覧ボタン
        const tabList = document.getElementById("view-tab-list");
        if (tabList) {
            tabList.addEventListener("mousedown", (event) =>
            {
                this.showTabList(event);
            });
        }
    }

    /**
     * @description タブの一覧をモーダルで表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    showTabList (event)
    {
        // 親のイベントを中止
        event.stopPropagation();

        const element = document.getElementById("tab-name-menu");
        if (element.classList.contains("fadeIn")) {
            return Util.$endMenu();
        }

        Util.$endMenu("tab-name-menu");

        const target = event.currentTarget;
        element.style.left = `${target.offsetLeft + target.offsetWidth}px`;
        element.style.top  = `${target.offsetTop + 25}px`;
        element.setAttribute("class", "fadeIn");
    }

    /**
     * @description スクリーンエリアのタブを追加
     *
     * @param  {WorkSpace} work_space
     * @param  {number}    id
     * @return {void}
     * @method
     * @public
     */
    createElement (work_space, id)
    {
        if (!work_space.name) {
            work_space.name = `Untitled-${id + 1}`;
        }

        // スクリーンエリアにタブのElementを追加
        document
            .getElementById("view-tab-area")
            .insertAdjacentHTML("beforeend", `
<div draggable="true" id="tab-id-${id}" data-tab-id="${id}" class="tab">
    <p id="tab-text-id-${id}" data-tab-id="${id}" data-detail="{{タブの移動・名前を変更}}" data-shortcut-key="ArrowLeftCtrl" data-shortcut-text="Ctrl + ← or →" data-area="global">${work_space.name}</p>
    <input type="text" id="tab-input-id-${id}" data-tab-id="${id}" value="${work_space.name}">
    <i id="tab-delete-id-${id}" data-tab-id="${id}" data-detail="{{プロジェクトを閉じる}}"></i>
</div>`);

        const div = document.getElementById(`tab-id-${id}`);

        // モーダル表示を登録
        Util.$addModalEvent(div);

        div
            .classList
            .add(Util.$activeWorkSpaceId === id ? "active" : "disable");

        div.addEventListener("mousedown", (event) =>
        {
            this.activeTab(event);
        });

        // ドロップでタブを移動する
        div.addEventListener("dragstart", (event) =>
        {
            this.dragStart(event);
        });

        div.addEventListener("dragover", (event) =>
        {
            this.dragOver(event);
        });

        div.addEventListener("dragleave", (event) =>
        {
            this.dragLeave(event);
        });

        div.addEventListener("drop", (event) =>
        {
            this.drop(event);
        });

        // 削除アイコンに削除関数を登録
        document
            .getElementById(`tab-delete-id-${id}`)
            .addEventListener("click", (event) =>
            {
                this.deleteTab(event);
            });

        // タイトルインプットタグをコントロールする関数を追加
        document
            .getElementById(`tab-text-id-${id}`)
            .addEventListener("dblclick", (event) =>
            {
                this.editStart(event);
            });

        // inputタグは非表示にする
        const input = document
            .getElementById(`tab-input-id-${id}`);

        if (input) {
            input.style.display = "none";

            input.addEventListener("focusout", (event) =>
            {
                this.editEnd(event);
            });
            input.addEventListener("keypress", (event) =>
            {
                this.editEnd(event);
            });
        }

        // タブ一覧にElementを追加
        document
            .getElementById("tab-name-menu-list")
            .insertAdjacentHTML("beforeend", `
<div id="tab-menu-id-${id}" data-tab-id="${id}">${work_space.name}</div>`);

        // マウスイベントでアクティブになるよう関数を登録
        const menu = document
            .getElementById(`tab-menu-id-${id}`);

        if (menu) {
            menu.addEventListener("mousedown", (event) =>
            {
                this.activeTab(event, true);
            });
        }
    }

    /**
     * @description ドロップ先のElementとドラッグしたElementを入れ替える
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    drop (event)
    {
        // 親のイベントを中止
        event.preventDefault();

        this.save();

        // スタイルを削除
        event
            .currentTarget
            .classList
            .remove("drop-target");

        const nextElement = event
            .currentTarget
            .nextElementSibling;

        document
            .getElementById("view-tab-area")
            .insertBefore(
                this._$dropTab,
                this._$dropTab === nextElement
                    ? event.currentTarget
                    : nextElement
            );

        // 初期化
        this._$dropTab = null;
        this._$saved   = false;
    }

    /**
     * @description ヒットしたElementから抜けたスタイルを削除
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    dragLeave (event)
    {
        // 親のイベントを中止
        event.preventDefault();

        event
            .currentTarget
            .classList
            .remove("drop-target");
    }

    /**
     * @description ドラッグしたElementがヒットしたElementにスタイルを追加
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    dragOver (event)
    {
        // 親のイベントを中止
        event.preventDefault();

        event
            .currentTarget
            .classList
            .add("drop-target");
    }

    /**
     * @description ドラッグスタート関数、ドラッグするElementを変数に格納
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    dragStart (event)
    {
        // モーダルを非表示にする
        Util.$endMenu();

        // ドラッグするElementを変数に格納
        this._$dropTab = event.currentTarget;
    }

    /**
     * @description タブのリスト移動した時
     *
     * @param  {MouseEvent} event
     * @param  {boolean} move_tab
     * @return {void}
     * @method
     * @public
     */
    activeTab (event, move_tab = false)
    {
        // モーダルを非表示にする
        Util.$endMenu();

        // アクティブなタブを非アクティブな状態に
        const activeElement = document
            .getElementById(`tab-id-${Util.$activeWorkSpaceId}`);

        if (activeElement) {
            activeElement
                .classList
                .remove("active");

            activeElement
                .classList
                .add("disable");
        }

        // 非アクティブなタブをアクティブな状態に
        const tabId = event.currentTarget.dataset.tabId | 0;

        const tab = document
            .getElementById(`tab-id-${tabId}`);
        if (tab) {
            tab
                .classList
                .remove("disable");

            tab
                .classList
                .add("active");

            // 指定したタブを左端に移動
            if (move_tab) {
                const area = document
                    .getElementById("view-tab-area");

                tab.remove();
                area.prepend(tab);
            }
        }

        // 対象のWorkSpaceに切り替える
        if (Util.$activeWorkSpaceId !== tabId) {
            Util.$changeWorkSpace(tabId);
        }
    }

    /**
     * @description タブの削除関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    deleteTab (event)
    {
        event.preventDefault();

        const message = Util.$currentLanguage.replace(
            "{{プロジェクトが保存されていない場合、" +
            "このタブのプロジェクトデータを復旧する事はできません。" +
            "タブを削除しますか？}}"
        );

        // 削除前に警告を表示
        if (!window.confirm(message)) {
            return ;
        }

        // 作業スペースを削除
        const tabId = event.currentTarget.dataset.tabId | 0;

        Util.$workSpaces[tabId] = null;

        document
            .getElementById(`tab-id-${tabId}`)
            .remove();

        document
            .getElementById(`tab-menu-id-${tabId}`)
            .remove();

        // ライブラリタブのプレビュー表示を削除
        const previewElement = document
            .getElementById("library-preview-area");

        while (previewElement.children.length) {
            previewElement.children[0].remove();
        }

        // タブが0になった場合は空のタブを追加する
        const parent = document.getElementById("view-tab-area");
        if (!parent.children.length) {

            // reset
            Util.$workSpaces.length = 0;
            Util.$activeWorkSpaceId = 0;

            // new WorkSpace
            const workSpace = new WorkSpace();
            Util.$workSpaces.push(workSpace);

            // create tab
            this.createElement(workSpace, 0);

            // start
            workSpace.run();

            const element = parent.children[0];
            element.setAttribute("class", "tab active");

        } else {

            // アクティブなタブを削除する場合は、左端のタブをアクティブにする
            if (Util.$activeWorkSpaceId === tabId) {

                const element = parent.children[0];
                element.setAttribute("class", "tab active");

                Util.$activeWorkSpaceId = element.dataset.tabId | 0;

                Util.$currentWorkSpace().run();
            }

        }
    }

    /**
     * @description タブのタイトル編集を開始
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    editStart (event)
    {
        Util.$keyLock = true;

        const element = event.currentTarget;
        const tabId   = element.dataset.tabId | 0;

        const input = document
            .getElementById(`tab-input-id-${tabId}`);

        if (input.style.display === "none") {

            input.style.width     = `${element.offsetWidth}px`;
            input.style.display   = "";
            element.style.display = "none";
            input.focus();

            const parent = document
                .getElementById(`tab-id-${tabId}`);

            parent.draggable = false;
        }
    }

    /**
     * @description タブのタイトル編集を終了する関数
     *
     * @param  {Event|KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    editEnd (event)
    {
        if (event.key === "Enter") {
            event.target.blur();
            return ;
        }

        if (event.type === "focusout") {

            this.save();

            const element = event.currentTarget;
            element.style.display = "none";

            const tabId = element.dataset.tabId | 0;

            const p = document
                .getElementById(`tab-text-id-${tabId}`);

            const menu = document.getElementById(`tab-menu-id-${tabId}`);
            const workSpace = Util.$workSpaces[tabId];

            workSpace.name   = element.value;
            menu.textContent = element.value;
            p.textContent    = element.value;
            p.style.display  = "";

            const parent = document
                .getElementById(`tab-id-${tabId}`);

            parent.draggable = true;

            this._$saved = false;
        }
    }

    /**
     * @description タブ追加関数、WorkSpaceクラスを作成して、タブのElementを追加する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    addTab (event)
    {
        Util.$endMenu();

        // 親のイベントを中止
        event.stopPropagation();

        this.save();

        const id = Util.$workSpaces.length;
        const workSpace = new WorkSpace();

        Util.$workSpaces.push(workSpace);
        this.createElement(workSpace, id);

        this._$saved = false;
    }

    /**
     * @description undo用にデータを内部保管する
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (!this._$saved) {
            this._$saved = true;

            Util
                .$currentWorkSpace()
                .temporarilySaved();
        }
    }
}

Util.$screenTab = new ScreenTab();
