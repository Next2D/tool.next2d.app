/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class Controller extends BaseController
{
    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        super.initialize();

        const element = document
            .getElementById("controller");

        if (element) {
            element.addEventListener("mouseover", () =>
            {
                Util.$setCursor("auto");
            });
        }
    }

    /**
     * @description 指定したIDを表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    showObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            const element = document.getElementById(names[idx]);
            if (!element) {
                continue;
            }
            element.style.display = "";
        }
    }

    /**
     * @description 指定したIDを非表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    hideObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            const element = document.getElementById(names[idx]);
            if (!element) {
                continue;
            }
            element.style.display = "none";
        }
    }

    /**
     * @description 初期表示に戻す
     *
     * @return {void}
     * @method
     * @public
     */
    default ()
    {
        // フィルターを初期化
        Util.$filterController.clearFilters();

        this.hideObjectSetting([
            "object-area",
            "instance-setting",
            "fill-color-setting"
        ]);

        this.showObjectSetting([
            "stage-setting",
            "sound-setting",
            "object-setting",
            "color-setting",
            "blend-setting",
            "filter-setting"
        ]);

        const workSpace = Util.$currentWorkSpace();
        if (workSpace) {
            const scene = workSpace.scene;

            const objectName = document
                .getElementById("object-name");

            if (objectName) {
                objectName.value = scene.name;
            }

            const objectSymbol = document
                .getElementById("object-symbol");

            if (objectSymbol) {
                objectSymbol.value = scene.symbol;
            }
        }
    }
}

Util.$controller = new Controller();
