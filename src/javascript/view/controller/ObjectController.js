/**
 * @class
 * @memberOf view.controller
 */
class ObjectController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("object");
    }

    /**
     * @description オブジェクトコントローラーの初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const objectName = document.getElementById("object-name");
        if (objectName) {
            objectName.addEventListener("focusout", (event) =>
            {
                this.finishInput(event, false);
            });
            objectName.addEventListener("keypress", (event) =>
            {
                this.finishInput(event, false);
            });
            objectName.addEventListener("focusin", (event) =>
            {
                this.focusIn(event);
            });
        }

        const objectSymbol = document.getElementById("object-symbol");
        if (objectSymbol) {
            objectSymbol.addEventListener("focusout", (event) =>
            {
                this.finishInput(event, false);
            });
            objectSymbol.addEventListener("keypress", (event) =>
            {
                this.finishInput(event, false);
            });
            objectSymbol.addEventListener("focusin", (event) =>
            {
                this.focusIn(event);
            });
        }
    }

    /**
     * @description シンボル名を反映
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeObjectSymbol (value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        switch (tool.activeElements.length) {

            case 0:
                Util
                    .$currentWorkSpace()
                    .scene
                    .symbol = value;
                break;

            case 1:
                {
                    const element = tool.activeElements[0];
                    Util
                        .$currentWorkSpace()
                        .getLibrary(
                            element.dataset.libraryId | 0
                        )
                        .symbol = value;
                }
                break;

            default:
                break;

        }

        return value;
    }

    /**
     * @description インスタン名を反映
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeObjectName (value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        switch (tool.activeElements.length) {

            case 0:
                Util
                    .$currentWorkSpace()
                    .scene
                    .name = value;
                break;

            case 1:
                {
                    const element = tool.activeElements[0];

                    const layer = Util
                        .$currentWorkSpace()
                        .scene
                        .getLayer(
                            element.dataset.layerId | 0
                        );

                    const character = layer.getCharacter(
                        element.dataset.characterId | 0
                    );

                    character.name = value;
                }
                break;

            default:
                break;

        }

        return value;
    }
}

Util.$objectController = new ObjectController();
