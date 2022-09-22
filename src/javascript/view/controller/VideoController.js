/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class VideoController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("video");
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_VOLUME ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_VOLUME ()
    {
        return 100;
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
            "video-loop-select",
            "video-auto-select"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(elementIds[idx])
            );
        }

        this.setInputEvent(
            document.getElementById("video-volume")
        );
    }

    /**
     * @description Videoのループ設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeVideoLoopSelect (value)
    {
        this.updateVideoProperty("loop", (value | 0) === 1);
    }

    /**
     * @description Videoの自動再生設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeVideoAutoSelect (value)
    {
        this.updateVideoProperty("autoPlay", (value | 0) === 1);
    }

    /**
     * @description Videoの音声設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeVideoVolume (value)
    {
        value = Util.$clamp(
            value | 0,
            VideoController.MIN_VOLUME,
            VideoController.MAX_VOLUME
        );

        this.updateVideoProperty("volume", value);

        return value;
    }

    /**
     * @description Videoコントローラーの値を更新
     * @param {string} name
     * @param {*} value
     * @method
     * @public
     */
    updateVideoProperty (name, value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const element  = activeElements[0];
        const instance = Util.$currentWorkSpace().getLibrary(
            element.dataset.libraryId | 0
        );

        instance[name] = value;
    }
}

Util.$videoController = new VideoController();
