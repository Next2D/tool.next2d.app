/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class TextController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("text");
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_SIZE ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_SIZE ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_FONT_SIZE ()
    {
        return 10;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_FONT_SIZE ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_STROKE_SIZE ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STROKE_SIZE ()
    {
        return 200;
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

        const selectIds = [
            "font-select",
            "font-style-select",
            "font-align-select",
            "font-wrap-select",
            "font-input-select",
            "font-scroll-select",
            "font-border-select",
            "font-auto-size-select",
            "font-color",
            "font-stroke-color"
        ];

        for (let idx = 0; idx < selectIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(selectIds[idx])
            );
        }

        const inputIds = [
            "font-size",
            "font-stroke-size",
            "font-leading",
            "font-letterSpacing",
            "font-leftMargin",
            "font-rightMargin"
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }
    }

    /**
     * @description 行間の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontLeading (value)
    {
        value = Util.$clamp(
            value | 0,
            TextController.MIN_SIZE,
            TextController.MAX_SIZE
        );

        this.updateText({
            "name": "leading",
            "value": value
        });

        return value;
    }

    /**
     * @description 文字幅の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontLetterSpacing (value)
    {
        value = Util.$clamp(
            value | 0,
            -TextController.MAX_SIZE,
            TextController.MAX_SIZE
        );

        this.updateText({
            "name": "letterSpacing",
            "value": value
        });

        return value;
    }

    /**
     * @description 左マージンの値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontLeftMargin (value)
    {
        value = Util.$clamp(
            value | 0,
            TextController.MIN_SIZE,
            TextController.MAX_SIZE
        );

        this.updateText({
            "name": "leftMargin",
            "value": value
        });

        return value;
    }

    /**
     * @description 右マージンの値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontRightMargin (value)
    {
        value = Util.$clamp(
            value | 0,
            TextController.MIN_SIZE,
            TextController.MAX_SIZE
        );

        this.updateText({
            "name": "rightMargin",
            "value": value
        });

        return value;
    }

    /**
     * @description テキスト枠のサイズを変更
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontStrokeSize (value)
    {
        value = Util.$clamp(
            value | 0,
            TextController.MIN_STROKE_SIZE,
            TextController.MAX_STROKE_SIZE
        );

        this.updateText({
            "name": "thickness",
            "value": value
        });

        return value;
    }

    /**
     * @description テキストサイズを変更
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFontSize (value)
    {
        value = Util.$clamp(
            value | 0,
            TextController.MIN_FONT_SIZE,
            TextController.MAX_FONT_SIZE
        );

        this.updateText({
            "name": "size",
            "value": value
        });

        return value;
    }

    /**
     * @description テキスト枠のカラーを設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontStrokeColor (value)
    {
        this.updateText({
            "name": "thicknessColor",
            "value": `0x${value.slice(1)}` | 0
        });
    }

    /**
     * @description テキストのカラーを設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontColor (value)
    {
        this.updateText({
            "name": "color",
            "value": `0x${value.slice(1)}` | 0
        });
    }

    /**
     * @description テキストのフォントを指定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontSelect (value)
    {
        this.updateText({
            "name": "font",
            "value": value
        });
    }

    /**
     * @description テキストエリアの改行設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontStyleSelect (value)
    {
        value |= 0;
        this.updateText({
            "name": "fontType",
            "value": Util.$clamp(value, 0, 3)
        });
    }

    /**
     * @description テキストエリアの改行設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontAlignSelect (value)
    {
        switch (value) {

            case "left":
            case "center":
            case "right":
                this.updateText({
                    "name": "align",
                    "value": value
                });
                break;

            default:
                break;

        }
    }

    /**
     * @description テキストエリアの改行設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontWrapSelect (value)
    {
        switch (value | 0) {

            case 0:
                this.updateText({
                    "name": "wordWrap",
                    "value": false
                });
                this.updateText({
                    "name": "multiline",
                    "value": false
                });
                break;

            case 1:
                this.updateText({
                    "name": "wordWrap",
                    "value": false
                });
                this.updateText({
                    "name": "multiline",
                    "value": true
                });
                break;

            case 2:
                this.updateText({
                    "name": "wordWrap",
                    "value": true
                });
                this.updateText({
                    "name": "multiline",
                    "value": true
                });
                break;

        }
    }

    /**
     * @description テキストエリアのスクロール機能のOn/Off設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontInputSelect (value)
    {
        value |= 0;
        this.updateText({
            "name": "inputType",
            "value": value ? "input" : "static"
        });
    }

    /**
     * @description テキストエリアのスクロール機能のOn/Off設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontScrollSelect (value)
    {
        this.updateText({
            "name": "scroll",
            "value": !!(value | 0)
        });
    }

    /**
     * @description テキストエリアのボータ表示設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFontBorderSelect (value)
    {
        this.updateText({
            "name": "border",
            "value": !!(value | 0)
        });
    }

    /**
     * @description オートリサイズのSelect変更時の関数
     * @param  {number} value
     * @return {void}
     * @method
     * @public
     */
    changeFontAutoSizeSelect (value)
    {
        value |= 0;
        this.updateText({
            "name": "autoSize",
            "value": Util.$clamp(value, 0, 2)
        });
    }

    /**
     * @description テキストのプロパティーを更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    updateText (object)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        const element   = activeElements[0];

        // 対象レイヤーオブジェクト
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        // スクリーンで選択しているDisplayObject
        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        // ライブラリ内のインスタンスオブジェクト
        const instance = workSpace.getLibrary(character.libraryId);

        // 対象のプロパティーを更新
        instance[object.name] = object.value;

        // 再描画ように、キャッシュを削除
        character.dispose();
    }
}

Util.$textController = new TextController();
