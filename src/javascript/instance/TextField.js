/**
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class TextField extends Instance
{
    /**
     * @param {object} object
     * @constructor
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
     *
     * @return {TextField}
     * @method
     * @public
     */
    clone ()
    {
        return new TextField(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
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
     * @param  {array} [matrix=null]
     * @return {object}
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
     * @return {string}
     * @public
     */
    get text ()
    {
        return this._$text;
    }

    /**
     * @param {string} text
     * @public
     */
    set text (text)
    {
        this._$text = text;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get size ()
    {
        return this._$size;
    }

    /**
     * @param {number} size
     * @public
     */
    set size (size)
    {
        this._$size = size | 0;
        this.resize();
    }

    /**
     * @return {string}
     * @public
     */
    get font ()
    {
        return this._$font;
    }

    /**
     * @param {string} font
     * @public
     */
    set font (font)
    {
        this._$font = font;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get fontType ()
    {
        return this._$fontType;
    }

    /**
     * @param {number} font_type
     * @public
     */
    set fontType (font_type)
    {
        this._$fontType = font_type | 0;
        this.resize();
    }

    /**
     * @return {string}
     * @public
     */
    get inputType ()
    {
        return this._$inputType;
    }

    /**
     * @param {string} input_type
     * @public
     */
    set inputType (input_type)
    {
        this._$inputType = input_type;
    }

    /**
     * @return {string}
     * @public
     */
    get align ()
    {
        return this._$align;
    }

    /**
     * @param {string} align
     * @public
     */
    set align (align)
    {
        this._$align = align;
    }

    /**
     * @return {number}
     * @public
     */
    get color ()
    {
        return this._$color;
    }

    /**
     * @param {number} color
     * @public
     */
    set color (color)
    {
        this._$color = color | 0;
    }

    /**
     * @return {number}
     * @public
     */
    get leading ()
    {
        return this._$leading;
    }

    /**
     * @param {number} leading
     * @public
     */
    set leading (leading)
    {
        this._$leading = leading | 0;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get letterSpacing ()
    {
        return this._$letterSpacing;
    }

    /**
     * @param {number} letter_spacing
     * @public
     */
    set letterSpacing (letter_spacing)
    {
        this._$letterSpacing = letter_spacing | 0;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get leftMargin ()
    {
        return this._$leftMargin;
    }

    /**
     * @param {number} left_margin
     * @public
     */
    set leftMargin (left_margin)
    {
        this._$leftMargin = left_margin | 0;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get rightMargin ()
    {
        return this._$rightMargin;
    }

    /**
     * @param {number} right_margin
     * @public
     */
    set rightMargin (right_margin)
    {
        this._$rightMargin = right_margin | 0;
        this.resize();
    }

    /**
     * @return {boolean}
     * @public
     */
    get multiline ()
    {
        return this._$multiline;
    }

    /**
     * @param {boolean} multiline
     * @public
     */
    set multiline (multiline)
    {
        this._$multiline = !!multiline;
        this.resize();
    }

    /**
     * @return {boolean}
     * @public
     */
    get border ()
    {
        return this._$border;
    }

    /**
     * @param {boolean} border
     * @public
     */
    set border (border)
    {
        this._$border = !!border;
    }

    /**
     * @return {boolean}
     * @public
     */
    get scroll ()
    {
        return this._$scroll;
    }

    /**
     * @param {boolean} scroll
     * @public
     */
    set scroll (scroll)
    {
        this._$scroll = !!scroll;
    }

    /**
     * @return {boolean}
     * @public
     */
    get wordWrap ()
    {
        return this._$wordWrap;
    }

    /**
     * @param {boolean} word_wrap
     * @public
     */
    set wordWrap (word_wrap)
    {
        this._$wordWrap = !!word_wrap;
        this.resize();
    }

    /**
     * @return {object}
     * @public
     */
    get bounds ()
    {
        return this._$bounds;
    }

    /**
     * @param {object} [bounds=null]
     * @public
     */
    set bounds (bounds)
    {
        this._$bounds = bounds;
    }

    /**
     * @return {object}
     * @public
     */
    get originBounds ()
    {
        return this._$originBounds;
    }

    /**
     * @param {object} origin_bounds
     * @public
     */
    set originBounds (origin_bounds)
    {
        this._$originBounds = origin_bounds;
    }

    /**
     * @return {number}
     * @public
     */
    get autoSize ()
    {
        return this._$autoSize;
    }

    /**
     * @param {number} auto_size
     * @public
     */
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
     * @return {number}
     * @public
     */
    get thickness ()
    {
        return this._$thickness;
    }

    /**
     * @param {number} thickness
     * @public
     */
    set thickness (thickness)
    {
        this._$thickness = thickness | 0;
        this.resize();
    }

    /**
     * @return {number}
     * @public
     */
    get thicknessColor ()
    {
        return this._$thicknessColor;
    }

    /**
     * @param {number} thickness_color
     * @public
     */
    set thicknessColor (thickness_color)
    {
        this._$thicknessColor = thickness_color | 0;
    }

    /**
     * @return {object}
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
        return window.next2d.text.TextField.namespace;
    }

    /**
     * @return {object}
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
     * @return {void}
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
     * @return {next2d.text.TextField}
     * @public
     */
    createInstance ()
    {
        const { TextField } = window.next2d.text;
        const textField = new TextField();

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

        return textField;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @param  {object}  place
     * @param  {object}  [range = null]
     * @param  {number}  [static_frame = 0]
     * @param  {boolean} [preview = false]
     * @return {HTMLImageElement}
     * @method
     * @public
     */
    toImage (
        width, height, place, range = null, static_frame = 0, preview = false
    ) {

        const image = super.toImage(
            width, height, place, range, static_frame, preview
        );

        image._$tx -= this._$thickness;
        image._$ty -= this._$thickness;

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
            image._$tx -= resizeX;
        }

        return image;
    }
}
