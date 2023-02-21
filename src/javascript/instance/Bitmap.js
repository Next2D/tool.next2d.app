/**
 * 画像データを管理するクラス、Next2DのShapeクラスとして出力されます。
 * The output is as a Next2D Shape class, a class that manages image data.
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class Bitmap extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object)
    {
        super(object);

        this.imageType = object.imageType;
        this.width     = object.width;
        this.height    = object.height;

        this._$buffer = null;
        if (object.buffer) {
            this.buffer = object.buffer;
        }
        this._$command = null;
        this._$binary  = "";
    }

    /**
     * @description Bitmapクラスを複製
     *              Duplicate Bitmap class
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
            "text-setting",
            "loop-setting",
            "video-setting",
            "fill-color-setting",
            "nine-slice-setting"
        ]);
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
     * @description シンボルを指定した時の継承先を返す
     *              Returns the inheritance destination when a symbol is specified.
     *
     * @return {string}
     * @public
     * @readonly
     */
    get defaultSymbol ()
    {
        return window.next2d.display.Shape.namespace;
    }

    /**
     * @description 画像のカラー配列のバイナリデータ
     *              Binary data of the color array of the image
     *
     * @default ""
     * @member {Uint8Array|string}
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
     * @description 画像種別を返す(image/png, image/jpeg, image/gif, etc...)
     *              return image type (image/png, image/jpeg, image/gif, etc...)
     *
     * @member {string}
     * @public
     */
    get imageType ()
    {
        return this._$imageType;
    }
    set imageType (image_type)
    {
        this._$imageType = image_type;
    }

    /**
     * @description 画像の幅を返す
     *              Return image width
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        return this._$width;
    }
    set width (width)
    {
        this._$width = width;
    }

    /**
     * @description 画像の高さを返す
     *              Returns the height of the image
     *
     * @return {number}
     * @public
     */
    get height ()
    {
        return this._$height;
    }
    set height (height)
    {
        this._$height = height;
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
            "symbol":  this.symbol,
            "extends": this.defaultSymbol,
            "buffer":  Array.from(this._$buffer),
            "bounds":  this.getBounds()
        };
    }

    /**
     * @description Next2DのShapeを生成
     *              Generate Next2D Shape
     *
     * @return {next2d.display.Shape}
     * @method
     * @public
     */
    createInstance ()
    {
        const { Shape, BitmapData } = window.next2d.display;
        const { width, height } = this;

        const shape = new Shape();
        shape._$instanceId = this._$instanceId;

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
