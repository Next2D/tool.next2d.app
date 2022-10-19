/**
 * @class
 * @memberOf view.tool
 */
class Project
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
        // ファイル読み込み
        const loadElement = document
            .getElementById("tools-load");

        if (loadElement) {
            loadElement
                .addEventListener("click", (event) =>
                {
                    event.preventDefault();
                    this.open();
                });
        }

        const fileInput = document
            .getElementById("tools-load-file-input");

        if (fileInput) {
            fileInput
                .addEventListener("change", (event) =>
                {
                    const files = event.target.files;
                    for (let idx = 0; idx < files.length; ++idx) {
                        this.load(files[idx]);
                    }

                    // reset
                    event.target.value = "";
                });
        }

        const saveElement = document
            .getElementById("tools-save");

        if (saveElement) {
            saveElement
                .addEventListener("click", (event) =>
                {
                    event.preventDefault();
                    this.save();
                });
        }

        const exportElement = document
            .getElementById("tools-export");

        if (exportElement) {
            exportElement
                .addEventListener("click", (event) =>
                {
                    event.preventDefault();
                    this.publish();
                });
        }

        const languageElement = document
            .getElementById("language-setting");

        if (languageElement) {

            const language = localStorage
                .getItem(`${Util.PREFIX}@language-setting`);

            if (language) {
                const children = languageElement.children;
                for (let idx = 0; idx < children.length; ++idx) {
                    const node = children[idx];
                    if (node.value === language) {
                        node.selected = true;
                        break;
                    }
                }
            }

            languageElement
                .addEventListener("change", (event) =>
                {
                    const language = event.target.value;

                    const LanguageClass = Util.$languages.get(language);
                    Util.$currentLanguage = new LanguageClass();

                    localStorage
                        .setItem(`${Util.PREFIX}@language-setting`, language);

                    Util.$addModalEvent(document);
                });
        }
    }

    /**
     * @description 指定したフォーマットで書き出し
     *
     * @return {void}
     * @method
     * @public
     */
    publish ()
    {
        // ダウンロードリンクを生成
        const anchor = document.getElementById("save-anchor");

        if (anchor.href) {
            URL.revokeObjectURL(anchor.href);
        }

        const type = document
            .getElementById("publish-type-setting")
            .value;

        switch (type) {

            case "json":
                anchor.download = `${Util.$currentWorkSpace().name}.json`;
                anchor.href     = URL.createObjectURL(new Blob(
                    [Publish.toJSON()],
                    { "type" : "application/json" }
                ));
                anchor.click();
                break;

            case "zlib":
                Publish.toZlib();
                break;

            case "webm":
                Publish.toWebM();
                break;

            case "gif-loop":
                Publish.toGIF();
                break;

            case "gif":
                Publish.toGIF(-1);
                break;

            case "png":
                Publish.toPng();
                break;

            case "apng-loop":
                Publish.toApng(true);
                break;

            case "apng":
                Publish.toApng(false);
                break;

            case "custom":
                if ("CustomPublish" in window) {
                    window
                        .CustomPublish
                        .execute(Publish.toObject());
                }
                break;

        }
    }

    /**
     * @description n2dファイルの読み込み処理、zipデータ解凍
     *
     * @param  {File} file
     * @return {void}
     * @public
     */
    load (file)
    {
        file
            .arrayBuffer()
            .then((buffer) =>
            {
                const uint8Array = new Uint8Array(buffer);
                Util.$unZlibWorker.postMessage({
                    "buffer": uint8Array,
                    "name"  : file.name.replace(".n2d", ""),
                    "type"  : "n2d"
                }, [uint8Array.buffer]);
            });
    }

    /**
     * @description プロジェクトデータをローカルから選択する
     *
     * @return {void}
     * @method
     * @public
     */
    open ()
    {
        document
            .getElementById("tools-load-file-input")
            .click();
    }

    /**
     * @description プロジェクトデータをローカルへ保存
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        const postData = {
            "object": Util.$currentWorkSpace().toJSON(),
            "type": "n2d"
        };

        if (Util.$zlibWorkerActive) {

            Util.$zlibQueues.push(postData);

        } else {

            Util.$zlibWorkerActive = true;
            Util.$zlibWorker.postMessage(postData);

        }
    }
}

Util.$project = new Project();
