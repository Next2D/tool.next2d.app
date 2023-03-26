/**
 * コントローラー表示の管理クラス
 * Management class for controller display
 *
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class Controller extends BaseController
{
    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
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
     * @description 指定したIDを表示する
     *              Display the specified ID
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
            element.setAttribute("style", "");
        }
    }

    /**
     * @description 指定したIDを非表示にする
     *              Hide the specified ID
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
            element.setAttribute("style", "display: none;");
        }
    }

    /**
     * @description コントローラーの表示項目を初期表示に戻す
     *              Reset controller display items to initial display.
     *
     * @return {void}
     * @method
     * @public
     */
    default ()
    {
        // フィルターを初期化
        Util.$filterController.clear();

        this.hideObjectSetting([
            "object-area",
            "ruler-setting",
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
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

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

Util.$controller = new Controller();
