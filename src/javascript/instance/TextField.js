/**
 * テキストを管理するクラス、Next2DのTextFieldクラスとして出力されます。
 * The output is as a Next2D TextField class, a class that manages text.
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class TextField extends Instance
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        super(object);

        this._$text           = "";
        this._$font           = "sans-serif";
        this._$size           = 12;
        this._$align          = "left";
        this._$color          = 0;
        this._$fontType       = 0;
        this._$inputType      = "static";
        this._$leading        = 0;
        this._$letterSpacing  = 0;
        this._$leftMargin     = 0;
        this._$rightMargin    = 0;
        this._$autoSize       = 0;
        this._$multiline      = true;
        this._$wordWrap       = true;
        this._$border         = false;
        this._$scroll         = true;
        this._$cache          = null;
        this._$htmlText       = null;
        this._$thickness      = 0;
        this._$thicknessColor = 0;

        this._$bounds = {
            "xMin": 0,
            "xMax": TextField.FONT_DEFAULT_SIZE,
            "yMin": 0,
            "yMax": TextField.FONT_DEFAULT_SIZE
        };

        this._$originBounds = {
            "xMin": 0,
            "xMax": TextField.FONT_DEFAULT_SIZE,
            "yMin": 0,
            "yMax": TextField.FONT_DEFAULT_SIZE
        };

        if (object.text) {
            this.text = object.text;
        }

        if (object.font) {
            this.font = object.font;
        }

        if (object.fontType) {
            this.fontType = object.fontType;
        }

        if (object.inputType) {
            this.inputType = object.inputType;
        }

        if (object.size) {
            this.size = object.size;
        }

        if (object.align) {
            this.align = object.align;
        }

        if (object.color) {
            this.color = object.color;
        }

        if (object.leading) {
            this.leading = object.leading;
        }

        if (object.letterSpacing) {
            this.letterSpacing = object.letterSpacing;
        }

        if (object.leftMargin) {
            this.leftMargin = object.leftMargin;
        }

        if (object.rightMargin) {
            this.rightMargin = object.rightMargin;
        }

        if ("multiline" in object) {
            this.multiline = object.multiline;
        }

        if ("wordWrap" in object) {
            this.wordWrap = object.wordWrap;
        }

        if (object.autoFontSize) {
            this.autoFontSize = object.autoFontSize;
        }

        if ("scroll" in object) {
            this.scroll = object.scroll;
        }

        if (object.border) {
            this.border = object.border;
        }

        if (object.bounds) {
            this.bounds = object.bounds;
        }

        if (object.originBounds) {
            this.originBounds = object.originBounds;
        }

        if (object.autoSize) {
            this.autoSize = object.autoSize;
        }

        if (object.thickness) {
            this.thickness = object.thickness;
        }

        if (object.thicknessColor) {
            this.thicknessColor = object.thicknessColor;
        }
    }

    /**
     * @description テキストエリアのデフォルトの幅と高さのサイズ
     *              Default width and height size of text area
     *
     * @return {number}
     * @const
     * @static
     */
    static get FONT_DEFAULT_SIZE ()
    {
        return 200;
    }

    /**
     * @description TextFieldクラスを複製
     *              Duplicate TextField class
     *
     * @return {Video}
     * @method
     * @public
     */
    clone ()
    {
        return new TextField(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description このアイテムが設定されたDisplayObjectが選択された時
     *              内部情報をコントローラーに表示する
     *              When a DisplayObject with this item set is selected,
     *              internal information is displayed on the controller.
     *
     * @param  {object} place
     * @param  {string} [name=""]
     * @return {void}
     * @method
     * @public
     */
    showController(place, name = "")
    {
        super.showController(place, name);

        Util.$controller.hideObjectSetting([
            "video-setting",
            "loop-setting",
            "fill-color-setting",
            "nine-slice-setting"
        ]);

        Util.$controller.showObjectSetting([
            "text-setting"
        ]);

        const fontSelect = document
            .getElementById("font-select");

        // font
        fontSelect.children[0].selected = true;
        for (let idx = 0; idx < fontSelect.children.length; ++idx) {

            const node = fontSelect.children[idx];

            if (node.value !== this._$font) {
                continue;
            }

            node.selected = true;
            break;
        }

        const fontStyleSelect = document
            .getElementById("font-style-select");

        for (let idx = 0; idx < fontStyleSelect.children.length; ++idx) {

            const node = fontStyleSelect.children[idx];

            if ((node.value | 0) !== this._$fontType) {
                continue;
            }

            node.selected = true;
            break;
        }

        const fontAlignSelect = document
            .getElementById("font-align-select");

        for (let idx = 0; idx < fontAlignSelect.children.length; ++idx) {

            const node = fontAlignSelect.children[idx];

            if (node.value !== this._$align) {
                continue;
            }

            node.selected = true;
            break;
        }

        const fontWrapSelect = document
            .getElementById("font-wrap-select");

        switch (true) {

            case !this._$wordWrap && !this._$multiline:
                fontWrapSelect.children[0].selected = true;
                break;

            case !this._$wordWrap && this._$multiline:
                fontWrapSelect.children[1].selected = true;
                break;

            case this._$wordWrap && this._$multiline:
                fontWrapSelect.children[2].selected = true;
                break;

        }

        const fontInputSelect = document
            .getElementById("font-input-select");

        fontInputSelect.children[
            this._$inputType === "static" ? 0 : 1
        ].selected = true;

        document
            .getElementById("font-size")
            .value = `${this._$size}`;

        document
            .getElementById("font-color")
            .value = `#${this._$color.toString(16).padStart(6, "0")}`;

        document
            .getElementById("font-stroke-size")
            .value = `${this._$thickness}`;

        document
            .getElementById("font-stroke-color")
            .value = `#${this._$thicknessColor.toString(16).padStart(6, "0")}`;

        const params = [
            "font-leading",
            "font-letterSpacing",
            "font-leftMargin",
            "font-rightMargin"
        ];

        for (let idx = 0; idx < params.length; ++idx) {

            const name = params[idx];

            document
                .getElementById(name)
                .value = `${this[name.split("-")[1]]}`;

        }

        document
            .getElementById("font-auto-size-select")
            .children[this._$autoSize].selected = true;

        if (this._$border) {
            document
                .getElementById("font-border-select")
                .children[1].selected = true;
        }

        if (this._$scroll) {
            document
                .getElementById("font-scroll-select")
                .children[0].selected = true;
        }
    }

    /**
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @param  {array} [matrix=null]
     * @return {object}
     * @method
     * @public
     */
    getBounds (matrix = null)
    {
        const bounds = {
            "xMin": -this._$thickness,
            "xMax": this._$bounds.xMax + this._$thickness,
            "yMin": -this._$thickness,
            "yMax": this._$bounds.yMax + 4 + this._$thickness
        };

        return matrix
            ? Util.$boundsMatrix(bounds, matrix)
            : bounds;
    }

    /**
     * @description テキストエリアに登録した文字情報
     *              Text information registered in the text area
     *
     * @member {string}
     * @default ""
     * @public
     */
    get text ()
    {
        return this._$text;
    }
    set text (text)
    {
        this._$text = `${text}`;
        this.resize();
    }

    /**
     * @description テキストのフォントサイズ設定
     *              Font size setting for text
     *
     * @member {number}
     * @default 12
     * @public
     */
    get size ()
    {
        return this._$size;
    }
    set size (size)
    {
        this._$size = size | 0;
        this.resize();
    }

    /**
     * @description テキストのフォント設定
     *              Text font settings
     *
     * @member {string}
     * @default "sans-serif"
     * @public
     */
    get font ()
    {
        return this._$font;
    }
    set font (font)
    {
        this._$font = `${font}`;
        this.resize();
    }

    /**
     * @description テキストのフォントスタイルの設定
     *              Set font style for text
     *
     * @member {number}
     * @default 0
     * @public
     */
    get fontType ()
    {
        return this._$fontType;
    }
    set fontType (font_type)
    {
        this._$fontType = font_type | 0;
        this.resize();
    }

    /**
     * @description 入力モードの設定、入力不可(static)、入力可能(input)
     *              Input mode setting, input disabled (static), input enabled (input)
     *
     * @member {string}
     * @default "static"
     * @public
     */
    get inputType ()
    {
        return this._$inputType;
    }
    set inputType (input_type)
    {
        input_type = `${input_type}`.toLowerCase();
        this._$inputType = input_type === "static" ? input_type : "input";
    }

    /**
     * @description 段落の行揃えの設定を示します。
     *              Indicates the alignment of the paragraph.
     *
     * @member {string}
     * @default "left"
     * @public
     */
    get align ()
    {
        return this._$align;
    }
    set align (align)
    {
        align = `${align}`.toLowerCase();
        switch (align) {

            case "right":
            case "center":
                this._$align = align;
                break;

            default:
                this._$align = "left";
                break;

        }
        this._$align = align;
    }

    /**
     * @description フォントの塗り色の設定
     *              Font fill color setting
     *
     * @member {number}
     * @default 0
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = color | 0;
    }

    /**
     * @description 行間の垂直の行送りを示す整数です。
     *              An integer representing the amount
     *              of vertical space (called leading) between lines.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get leading ()
    {
        return this._$leading;
    }
    set leading (leading)
    {
        this._$leading = leading | 0;
        this.resize();
    }

    /**
     * @description すべての文字の間に均等に配分されるスペースの量を表す数値です。
     *              A object representing the amount
     *              of space that is uniformly distributed between all characters.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get letterSpacing ()
    {
        return this._$letterSpacing;
    }
    set letterSpacing (letter_spacing)
    {
        this._$letterSpacing = letter_spacing | 0;
        this.resize();
    }

    /**
     * @description 段落の左インデントをピクセル単位で示します。
     *              The left margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get leftMargin ()
    {
        return this._$leftMargin;
    }
    set leftMargin (left_margin)
    {
        this._$leftMargin = left_margin | 0;
        this.resize();
    }

    /**
     * @description 段落の右インデントをピクセル単位で示します。
     *              The right margin of the paragraph, in pixels.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get rightMargin ()
    {
        return this._$rightMargin;
    }
    set rightMargin (right_margin)
    {
        this._$rightMargin = right_margin | 0;
        this.resize();
    }

    /**
     * @description フィールドが複数行テキストフィールドであるかどうかを示します。
     *              Indicates whether field is a multiline text field.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get multiline ()
    {
        return this._$multiline;
    }
    set multiline (multiline)
    {
        this._$multiline = !!multiline;
        this.resize();
    }

    /**
     * @description テキストフィールドに境界線があるかどうかを指定します。
     *              Specifies whether the text field has a border.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get border ()
    {
        return this._$border;
    }
    set border (border)
    {
        this._$border = !!border;
    }

    /**
     * @description スクロール機能のon/off
     *              Scroll function on/off
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get scroll ()
    {
        return this._$scroll;
    }
    set scroll (scroll)
    {
        this._$scroll = !!scroll;
    }

    /**
     * @description テキストフィールドのテキストを折り返すかどうかを示すブール値です。
     *              A Boolean value that indicates whether the text field has word wrap.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get wordWrap ()
    {
        return this._$wordWrap;
    }
    set wordWrap (word_wrap)
    {
        this._$wordWrap = !!word_wrap;
        this.resize();
    }

    /**
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @member {object}
     * @public
     */
    get bounds ()
    {
        return this._$bounds;
    }
    set bounds (bounds)
    {
        this._$bounds = bounds;
    }

    /**
     * @description 登録時の表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box) at registration
     *
     * @member {object}
     * @public
     */
    get originBounds ()
    {
        return this._$originBounds;
    }
    set originBounds (origin_bounds)
    {
        this._$originBounds = origin_bounds;
    }

    /**
     * @description テキストエリア内のスケール設定
     *              Scale settings within text area
     *
     * @member {number}
     * @default 0
     * @public
     */
    get autoSize ()
    {
        return this._$autoSize;
    }
    set autoSize (auto_size)
    {
        this._$autoSize = auto_size | 0;
        if (this._$autoSize !== 1) {
            this._$bounds.xMax = this._$originBounds.xMax;
            this._$bounds.yMax = this._$originBounds.yMax;
        }
        this.resize();
    }

    /**
     * @description テキスト外枠の幅
     *              Width of text border
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thickness ()
    {
        return this._$thickness;
    }
    set thickness (thickness)
    {
        this._$thickness = thickness | 0;
        this.resize();
    }

    /**
     * @description テキスト外枠の色設定
     *              Color setting of text outer frame
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thicknessColor ()
    {
        return this._$thicknessColor;
    }
    set thicknessColor (thickness_color)
    {
        this._$thicknessColor = thickness_color | 0;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "id":             this.id,
            "name":           this.name,
            "type":           this.type,
            "symbol":         this.symbol,
            "folderId":       this.folderId,
            "text":           this.text,
            "font":           this.font,
            "fontType":       this.fontType,
            "inputType":      this.inputType,
            "size":           this.size,
            "align":          this.align,
            "color":          this.color,
            "leading":        this.leading,
            "letterSpacing":  this.letterSpacing,
            "leftMargin":     this.leftMargin,
            "rightMargin":    this.rightMargin,
            "multiline":      this.multiline,
            "wordWrap":       this.wordWrap,
            "border":         this.border,
            "autoSize":       this.autoSize,
            "scroll":         this.scroll,
            "originBounds":   this.originBounds,
            "bounds":         this.bounds,
            "thickness":      this.thickness,
            "thicknessColor": this.thicknessColor
        };
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.display.TextField.namespace;
    }

    /**
     * @description 書き出し用のObjectを返す
     *              Returns an Object for export
     *
     * @return {object}
     * @method
     * @public
     */
    toPublish ()
    {
        return {
            "symbol":         this.symbol,
            "extends":        this.defaultSymbol,
            "text":           this.text,
            "font":           this.font,
            "fontType":       this.fontType,
            "inputType":      this.inputType,
            "size":           this.size,
            "align":          this.align,
            "color":          this.color,
            "leading":        this.leading,
            "letterSpacing":  this.letterSpacing,
            "leftMargin":     this.leftMargin,
            "rightMargin":    this.rightMargin,
            "multiline":      this.multiline,
            "wordWrap":       this.wordWrap,
            "border":         this.border,
            "autoSize":       this.autoSize,
            "scroll":         this.scroll,
            "originBounds":   this.originBounds,
            "bounds":         this.bounds,
            "thickness":      this.thickness,
            "thicknessColor": this.thicknessColor
        };
    }

    /**
     * @description テキストエリアの状態変化による、表示領域を再取得
     *              Re-acquisition of display area due to change of text area status
     *
     * @return {void}
     * @method
     * @public
     */
    resize ()
    {
        const textField = this.createInstance();
        this._$bounds = {
            "xMin": textField._$bounds.xMin,
            "xMax": textField._$bounds.xMax,
            "yMin": textField._$bounds.yMin,
            "yMax": textField._$bounds.yMax
        };
    }

    /**
     * @description Next2DのDisplayObjectを生成
     *              Generate Next2D DisplayObject
     *
     * @return {next2d.display.Shape}
     * @method
     * @public
     */
    createInstance ()
    {
        const { TextField } = window.next2d.display;
        const textField = new TextField();
        textField._$loaderInfo  = Util.$loaderInfo;
        textField._$characterId = this.id;

        textField._$bounds = {
            "xMin": this._$originBounds.xMin,
            "xMax": this._$originBounds.xMax,
            "yMin": this._$originBounds.yMin,
            "yMax": this._$originBounds.yMax
        };
        textField._$originBounds = {
            "xMin": this._$originBounds.xMin,
            "xMax": this._$originBounds.xMax,
            "yMin": this._$originBounds.yMin,
            "yMax": this._$originBounds.yMax
        };

        const textFormat         = textField.defaultTextFormat;
        textFormat.font          = this._$font;
        textFormat.size          = this._$size;
        textFormat.align         = this._$align;
        textFormat.color         = this._$color;
        textFormat.leading       = this._$leading;
        textFormat.letterSpacing = this._$letterSpacing;
        textFormat.leftMargin    = this._$leftMargin;
        textFormat.rightMargin   = this._$rightMargin;

        switch (this._$fontType) {

            case 1:
                textFormat.bold = true;
                break;

            case 2:
                textFormat.italic = true;
                break;

            case 3:
                textFormat.bold   = true;
                textFormat.italic = true;
                break;

        }

        switch (this._$autoSize) {

            case 1:
                textField.autoSize = this._$align;
                break;

            case 2:
                textField.autoFontSize = true;
                break;

        }

        textField.multiline      = this._$multiline;
        textField.wordWrap       = this._$wordWrap;
        textField.border         = this._$border;
        textField.scroll         = this._$scroll;
        textField.thickness      = this._$thickness;
        textField.thicknessColor = this._$thicknessColor;
        textField.text           = this._$text;

        textField.defaultTextFormat = textFormat;

        return textField;
    }

    /**
     * @description Next2DのBitmapDataクラスを経由してImageクラスを生成
     *              Generate Image class via Next2D BitmapData class
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number}  width
     * @param  {number}  height
     * @param  {object}  place
     * @param  {object}  [range = null]
     * @param  {number}  [static_frame = 0]
     * @param  {boolean} [preview = false]
     * @return {Promise}
     * @method
     * @public
     */
    draw (
        canvas, width, height, place,
        range = null, static_frame = 0, preview = false
    ) {

        return super
            .draw(
                canvas, width, height, place,
                range, static_frame, preview
            )
            .then((canvas) =>
            {
                canvas._$tx -= this._$thickness;
                canvas._$ty -= this._$thickness;

                let resizeX = 0;
                switch (this._$autoSize) {

                    case 0:
                        if (this._$align === "right") {
                            resizeX = -4;
                        }
                        break;

                    case 1:
                        switch (this._$align) {

                            case "center":
                                resizeX = (this._$bounds.xMax - this._$originBounds.xMax) / 2;
                                if (resizeX) {
                                    resizeX -= 2;
                                }
                                break;

                            case "right":
                                resizeX = this._$originBounds.xMax - this._$bounds.xMax;
                                if (resizeX) {
                                    resizeX += 2;
                                    resizeX *= -1;
                                }
                                break;

                        }
                        break;

                }

                if (this._$autoSize === 1) {
                    canvas._$tx -= resizeX;
                }

                return Promise.resolve(canvas);
            });
    }
}
