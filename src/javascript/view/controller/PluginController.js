/**
 * @class
 */
class PluginController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
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

        // TODO
        const pluginBar = document
            .getElementById("plugin-bar");

        if (pluginBar) {
            pluginBar
                .addEventListener("mousedown", function (event)
                {
                    this._$pointX = event.screenX;
                    this._$pointY = event.screenY;
                    this._$movePanelModal = true;
                }.bind(this));
        }

        const pluginHideIcon = document
            .getElementById("plugin-hide-icon");

        if (pluginHideIcon) {
            pluginHideIcon
                .addEventListener("mousedown", window.nt.hidePanel);
        }

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-width",
                `${PluginController.PLUGIN_DEFAULT_WIDTH}px`
            );

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-height",
                `${PluginController.PLUGIN_DEFAULT_HEIGHT}px`
            );
    }

    /**
     * @return {number}
     * @static
     * @const
     */
    static get PLUGIN_DEFAULT_WIDTH ()
    {
        return 200;
    }

    /**
     * @return {number}
     * @static
     * @const
     */
    static get PLUGIN_DEFAULT_HEIGHT ()
    {
        return 200;
    }
}

Util.$pluginController = new PluginController();
