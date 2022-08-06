/**
 * @class
 * @extends {BaseController}
 */
class ReferenceController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("reference");
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

        const elementIds = [
            "transform-reference-x",
            "transform-reference-y"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(elementIds[idx])
            );
        }
    }

}

Util.$referenceController = new ReferenceController();
