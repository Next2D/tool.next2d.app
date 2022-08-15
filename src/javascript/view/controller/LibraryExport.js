/**
 * @class
 * @extends {BaseController}
 */
class LibraryExport extends BaseController
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
            "library-menu-export",
            "library-export-hide-icon"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                // 表示モーダルを全て終了
                Util.$endMenu();

                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                const names = event.target.id.split("-");

                let functionName = names
                    .map((value) =>
                    {
                        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                    })
                    .join("");

                this[`execute${functionName}`](event);
            });

        }
    }

    /**
     * @description 書き出しモーダルを非表示に
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryExportHideIcon ()
    {
        Util.$endMenu();
    }

    /**
     * @description 指定したアイテムを画像として書き出す
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuExport ()
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        const element = document
            .getElementById("library-export-modal");

        // 書き出しのモーダルを表示
        element.style.display = "";

        element.setAttribute("class", "fadeIn");

        Util.$endMenu("library-export-modal");

    }
}

Util.$libraryExport = new LibraryExport();
