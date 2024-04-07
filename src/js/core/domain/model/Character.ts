import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import { ExternalItemImpl } from "@/interface/ExternalItemImpl";

/**
 * @description キーフレームの管理クラス
 *              Keyframe management class
 *
 * @class
 */
export class Character
{
    private _$startFrame: number;
    private _$endFrame: number;
    private _$libraryId: number;
    private readonly _$matrix: number[];
    private readonly _$colorTransform: number[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$libraryId = -1;

        /**
         * @type {array}
         * @private
         */
        this._$matrix = [1, 0, 0, 1, 0, 0];

        /**
         * @type {array}
         * @private
         */
        this._$colorTransform = [0, 0, 0, 0, 1, 1, 1, 1];

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startFrame = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$endFrame = 0;
    }

    /**
     * @description ライブラリに読み込まれたアイテムID
     *              Item ID loaded in the library
     *
     * @member {number}
     * @public
     */
    get libraryId (): number
    {
        return this._$libraryId;
    }
    set libraryId (library_id: number)
    {
        this._$libraryId = library_id;
    }

    /**
     * @description matrixを返却
     *              Return matrix
     *
     * @member {array}
     * @readonly
     * @public
     */
    get matrix (): number[]
    {
        return this._$matrix;
    }

    /**
     * @description colorTransformを返却
     *              Return colorTransform
     *
     * @member {array}
     * @readonly
     * @public
     */
    get colorTransform (): number[]
    {
        return this._$colorTransform;
    }

    /**
     * @description x座標を返却
     *              Return x coordinate
     *
     * @member {number}
     * @public
     */
    get x (): number
    {
        return this._$matrix[4];
    }
    set x (x: number)
    {
        this._$matrix[4] = x;
    }

    /**
     * @description y座標を返却
     *              Return y coordinate
     *
     * @member {number}
     * @public
     */
    get y (): number
    {
        return this._$matrix[5];
    }
    set y (y: number)
    {
        this._$matrix[5] = y;
    }

    /**
     * @description 開始フレーム番号
     *              start frame number
     *
     * @member {number}
     * @public
     */
    get startFrame ()
    {
        return this._$startFrame;
    }
    set startFrame (start_frame)
    {
        this._$startFrame = start_frame | 0;
    }

    /**
     * @description 終了フレーム番号
     *              end frame number
     *
     * @member {number}
     * @public
     */
    get endFrame ()
    {
        return this._$endFrame;
    }
    set endFrame (end_frame)
    {
        this._$endFrame = end_frame | 0;
    }

    /**
     * @description 指定フレーム移動させる
     *              Move the specified frame
     *
     * @param  {number} move_frame
     * @return {void}
     * @method
     * @public
     */
    move (move_frame: number): void
    {
        this._$startFrame += move_frame;
        this._$endFrame   += move_frame;
    }

    /**
     * @description セーブオブジェクトからrestore
     *              restore from save object
     *
     * @param {objct} save_object
     * @method
     * @public
     */
    load (save_object: CharacterSaveObjectImpl): void
    {
        this._$libraryId  = save_object.libraryId;
        this._$startFrame = save_object.startFrame;
        this._$endFrame   = save_object.endFrame;
    }

    /**
     * @description 外部アイテムオブジェクトからロード
     *              Load from external item object
     *
     * @param  {ExternalItem} item
     * @return {void}
     * @method
     * @public
     */
    loadExternalItem (item: ExternalItemImpl<any>): void
    {
        this._$libraryId = item.id;
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): CharacterSaveObjectImpl
    {
        return {
            "libraryId": this._$libraryId,
            "startFrame": this._$startFrame,
            "endFrame": this._$endFrame
        };
    }
}