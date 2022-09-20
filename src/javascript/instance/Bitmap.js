/**
 * @class
 * @extends {Instance}
 */
class Bitmap extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        super(object);

        this.imageType = object.imageType;
        this.width = object.width;
        this.height = object.height;

        this._$buffer = null;
        if (object.buffer) {
            this.buffer = object.buffer;
        }
        this._$command = null;
        this._$binary = "";
    }

    /**
     * @description Bitmapクラスを複製
     *
     * @return {Bitmap}
     * @method
     * @public
     */
    clone ()
    {
        return new Bitmap(JSON.parse(JSON.stringify(this.toObject())));
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
            "text-setting",
            "loop-setting",
            "video-setting",
            "fill-color-setting",
            "nine-slice-setting"
        ]);
    }

    /**
     * @param  {array} [matrix=null]
     * @return {object}
     * @public
     */
    getBounds (matrix = null)
    {
        const bounds = {
            "xMin": 0,
            "xMax": this.width,
            "yMin": 0,
            "yMax": this.height
        };

        return matrix
            ? Util.$boundsMatrix(bounds, matrix)
            : bounds;
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.display.Shape.namespace;
    }

    /**
     * @return {string}
     * @public
     */
    get buffer ()
    {
        if (!this._$binary) {

            const length = this._$buffer.length;

            for (let idx = 0; idx < length; ++idx) {
                this._$binary += String.fromCharCode(this._$buffer[idx]);
            }

        }

        return this._$binary;
    }

    /**
     * @param  {string|Uint8Array} binary
     * @return {void}
     * @public
     */
    set buffer (binary)
    {

        switch (typeof binary) {

            case "object":
                if (binary.constructor === Uint8Array) {
                    this._$buffer = binary;
                }
                break;

            case "string":
                if (!this._$binary) {
                    let length = binary.length;

                    this._$buffer = new Uint8Array(length);
                    for (let idx = 0; idx < length; ++idx) {
                        this._$buffer[idx] = binary.charCodeAt(idx) & 0xff;
                    }

                    this._$binary = binary;
                }
                break;

            default:
                break;

        }
    }

    /**
     * @return {string}
     * @public
     */
    get imageType ()
    {
        return this._$imageType;
    }

    /**
     * @param  {string} image_type
     * @return {void}
     * @public
     */
    set imageType (image_type)
    {
        this._$imageType = image_type;
    }

    /**
     * @return {uint}
     * @public
     */
    get width ()
    {
        return this._$width;
    }

    /**
     * @param  {uint} width
     * @return {void}
     * @public
     */
    set width (width)
    {
        this._$width = width;
    }

    /**
     * @return {uint}
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @param  {uint} height
     * @return {void}
     * @public
     */
    set height (height)
    {
        this._$height = height;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this.width,
            "height":    this.height,
            "imageType": this.imageType,
            "buffer":    this.buffer
        };
    }

    /**
     * @return {object}
     * @public
     */
    toPublish ()
    {
        return {
            "symbol":  this.symbol,
            "extends": this.defaultSymbol,
            "buffer":  Array.from(this._$buffer),
            "bounds":  this.getBounds()
        };
    }

    /**
     * @return {next2d.display.Shape}
     * @public
     */
    createInstance ()
    {
        const { Shape, BitmapData } = window.next2d.display;
        const { width, height } = this;

        const shape = new Shape();

        const bitmapData = new BitmapData(width, height, true, 0);
        bitmapData._$buffer = this._$buffer;

        shape
            .graphics
            .beginBitmapFill(bitmapData, null, false)
            .drawRect(0, 0, width, height)
            .endFill();

        // setup
        shape.graphics._$maxAlpha = 1;
        shape.graphics._$canDraw  = true;
        shape.graphics._$xMin     = 0;
        shape.graphics._$xMax     = this.width;
        shape.graphics._$yMin     = 0;
        shape.graphics._$yMax     = this.height;
        shape.graphics._$command  = this._$command;

        return shape;
    }
}
