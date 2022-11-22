/**
 * 整列機能のコントローラークラス
 * Controller class for blend function
 *
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class AlignController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("align");
    }

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

        const elementIds = [
            "align-position-left",
            "align-position-center",
            "align-position-right",
            "align-position-top",
            "align-position-middle",
            "align-position-bottom",
            "align-stage-position-left",
            "align-stage-position-center",
            "align-stage-position-right",
            "align-stage-position-top",
            "align-stage-position-middle",
            "align-stage-position-bottom"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id);
            });
        }
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で左揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionLeft ()
    {
        Util.$screenMenu.alignment("left", "stage");
    }

    /**
     * @description 指定したDisplayObjectを左揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionLeft ()
    {
        Util.$screenMenu.alignment("left");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で中央揃え(水平方向)
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionCenter ()
    {
        Util.$screenMenu.alignment("center", "stage");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(水平方向)
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionCenter ()
    {
        Util.$screenMenu.alignment("center");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で右揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionRight ()
    {
        Util.$screenMenu.alignment("right", "stage");
    }

    /**
     * @description 指定したDisplayObjectを右揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionRight ()
    {
        Util.$screenMenu.alignment("right");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionTop ()
    {
        Util.$screenMenu.alignment("top", "stage");
    }

    /**
     * @description 指定したDisplayObjectを上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionTop ()
    {
        Util.$screenMenu.alignment("top");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionMiddle ()
    {
        Util.$screenMenu.alignment("middle", "stage");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionMiddle ()
    {
        Util.$screenMenu.alignment("middle");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignStagePositionBottom ()
    {
        Util.$screenMenu.alignment("bottom", "stage");
    }

    /**
     * @description 指定したDisplayObjectを下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    changeAlignPositionBottom ()
    {
        Util.$screenMenu.alignment("bottom");
    }
}

Util.$alignController = new AlignController();
