/**
 * @class
 * @extends {BaseController}
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

        const controller = document
            .getElementById("controller");

        if (controller) {
            controller.addEventListener("mouseover", () =>
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
            document.getElementById(names[idx]).style.display = "";
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
            document.getElementById(names[idx]).style.display = "none";
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

        const scene = Util.$currentWorkSpace().scene;

        document
            .getElementById("object-name")
            .value = scene.name;

        document
            .getElementById("object-symbol")
            .value = scene.symbol;
    }
}

Util.$controller = new Controller();
