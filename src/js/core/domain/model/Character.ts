import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import type { ExternalItemImpl } from "@/interface/ExternalItemImpl";
import type { BlendModeImpl } from "@/interface/BlendModeImpl";
import type { Layer } from "./Layer";
import { execute as characterCreateElementUseCase } from "@/core/application/Character/usecase/CharacterCreateElementUseCase";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcSetScaleXService } from "@/core/application/Character/service/CharacterCalcSetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcSetRotationService } from "@/core/application/Character/service/CharacterCalcSetRotationService";
import { $clamp } from "@/global/GlobalUtil";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import { execute as characterCalcGetBoundsService } from "@/core/application/Character/service/CharacterCalcGetBoundsService";

/**
 * @description DisplayObjectのユニークID
 *              Unique ID of DisplayObject
 *
 * @type {number}
 * @private
 */
let $characterId: number = 1;

/**
 * @description キーフレームの管理クラス
 *              Keyframe management class
 *
 * @class
 */
export class Character
{
    private _$id: number;
    private _$startFrame: number;
    private _$endFrame: number;
    private _$libraryId: number;
    private _$depth: number;
    private _$scaleX: number | null;
    private _$scaleY: number | null;
    private _$rotation: number | null;
    private _$blendMode: BlendModeImpl;
    private readonly _$matrix: number[];
    private readonly _$colorTransform: number[];
    private readonly _$filters: any[];
    private _$name: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._$id = $characterId++;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$libraryId = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$depth = 0;

        /**
         * @type {array}
         * @private
         */
        this._$matrix = [1, 0, 0, 1, 0, 0];

        /**
         * @type {array}
         * @private
         */
        this._$colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];

        /**
         * @type {string}
         * @default "normal"
         * @private
         */
        this._$blendMode = "normal";

        /**
         * @type {array}
         * @private
         */
        this._$filters = [];

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$scaleX = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$scaleY = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$rotation = null;

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

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";
    }

    /**
     * @description Characterのキャッシュ用の管理ID
     *              Management ID for Character cache
     *
     * @member {number}
     * @static
     */
    static get characterId (): number
    {
        return $characterId;
    }
    static set characterId (character_id: number)
    {
        $characterId = $clamp(character_id, 1, Number.MAX_VALUE);
    }

    /**
     * @description MovieClip内で有効なアクセス名
     *              Valid access name in MovieClip
     *
     * @member {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        // TODO
        this._$name = `${name}`.replace(/ /g, "").trim();
    }

    /**
     * @description キャッシュキーを返却
     *              Return cache key
     *
     * @member {string}
     * @public
     */
    get cacheKey (): string
    {
        let cacheKey = `${this._$libraryId}_${this._$id}`;

        // colorTransformがデフォルト値以外の場合はキャッシュキーに追加
        switch (true) {

            case this._$colorTransform[0] !== 1:
            case this._$colorTransform[1] !== 1:
            case this._$colorTransform[2] !== 1:
            case this._$colorTransform[4] !== 0:
            case this._$colorTransform[5] !== 0:
            case this._$colorTransform[6] !== 0:
                {
                    const r = Math.max(0, Math.min(255 * this._$colorTransform[0] + this._$colorTransform[4], 255));
                    const g = Math.max(0, Math.min(255 * this._$colorTransform[1] + this._$colorTransform[5], 255));
                    const b = Math.max(0, Math.min(255 * this._$colorTransform[2] + this._$colorTransform[6], 255));
                    cacheKey += `_${r}_${g}_${b}`;
                }
                break;

            default:
                break;

        }

        // TODO filters

        return cacheKey;
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
     * @description ブレンドモード
     *              Blend mode
     *
     * @member {string}
     * @public
     */
    get blendMode (): BlendModeImpl
    {
        return this._$blendMode;
    }
    set blendMode (blend_mode: BlendModeImpl)
    {
        this._$blendMode = blend_mode;
    }

    /**
     * @description 表示順の深さ(昇順)
     *              Depth of display order (ascending)
     *
     * @member {number}
     * @public
     */
    get depth (): number
    {
        return this._$depth;
    }
    set depth (depth: number)
    {
        this._$depth = depth;
    }

    /**
     * @description フィルターの配列を返却
     *              Return an array of filters
     *
     * @member {array}
     * @readonly
     * @public
     */
    get filters (): any[]
    {
        return this._$filters;
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
     * @description 透明度を返却
     *              Return transparency
     *
     * @member {number}
     * @readonly
     * @public
     */
    get alpha (): number
    {
        return $clamp(
            this._$colorTransform[3] + this._$colorTransform[7] / 255, 0, 1
        );
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
     * @description 幅を返却
     *              Return width
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        const bounds = this.getBounds();
        return bounds
            ? parseFloat(Math.abs(bounds.xMax - bounds.xMin).toFixed(2))
            : 0;
    }
    set width (width: number)
    {
        // TODO
        console.log(width);
    }

    /**
     * @description 高さを返却
     *              Return height
     *
     * @member {number}
     * @public
     */
    get height (): number
    {
        const bounds = this.getBounds();
        return bounds
            ? parseFloat(Math.abs(bounds.yMax - bounds.yMin).toFixed(2))
            : 0;
    }
    set height (height: number)
    {
        // TODO
        console.log(height);
    }

    /**
     * @description xスケールを返却
     *              Return x scale
     *
     * @member {number}
     * @public
     */
    get scaleX (): number
    {
        if (this._$scaleX === null) {
            this._$scaleX = characterCalcGetScaleXService(this._$matrix);
        }
        return this._$scaleX;
    }
    set scaleX (scale_x: number)
    {
        this._$scaleX = characterCalcSetScaleXService(
            scale_x,
            this._$scaleX,
            this._$matrix
        );
    }

    /**
     * @description yスケールを返却
     *              Return y scale
     *
     * @member {number}
     * @public
     */
    get scaleY (): number
    {
        if (this._$scaleY === null) {
            this._$scaleY = characterCalcGetScaleYService(this._$matrix);
        }
        return this._$scaleY;
    }
    set scaleY (scale_y: number)
    {
        this._$scaleY = characterCalcSetScaleXService(
            scale_y,
            this._$scaleY,
            this._$matrix
        );
    }

    /**
     * @description 回転角度を返却
     *              Return rotation angle
     *
     * @member {number}
     * @public
     */
    get rotation (): number
    {
        if (this._$rotation === null) {
            this._$rotation = Math.atan2(this._$matrix[1], this._$matrix[0]) * (180 / Math.PI);
        }
        return this._$rotation;
    }
    set rotation (rotation: number)
    {
        this._$rotation = characterCalcSetRotationService(
            rotation,
            this._$rotation,
            this._$matrix
        );
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
        this._$depth      = save_object.depth;
        this._$blendMode  = save_object.blendMode;
        this._$startFrame = save_object.startFrame;
        this._$endFrame   = save_object.endFrame;
        this._$name       = save_object.name;

        // 配列を上書き
        if (save_object.matrix) {
            this._$matrix.splice(0, this._$matrix.length, ...save_object.matrix);
        }
        if (save_object.colorTransform) {
            this._$colorTransform.splice(0, this._$colorTransform.length, ...save_object.colorTransform);
        }
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
     * @description 描画処理
     *              Drawing process
     *
     * @param  {HTMLElement} element
     * @param  {Layer} layer
     * @return {Promise}
     * @method
     * @public
     */
    async createElement (element: HTMLElement, layer: Layer): Promise<HTMLDivElement | null>
    {
        return await characterCreateElementUseCase(this, element, layer);
    }

    /**
     * @description バウンディングボックスを取得
     *              Get the bounding box
     *
     * @return {object}
     * @method
     * @public
     */
    getBounds (): BoundsImpl | null
    {
        return characterCalcGetBoundsService(this._$libraryId, this._$matrix);
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
            "depth": this._$depth,
            "blendMode": this._$blendMode,
            "matrix": this._$matrix,
            "colorTransform": this._$colorTransform,
            "startFrame": this._$startFrame,
            "endFrame": this._$endFrame,
            "name": this._$name
        };
    }
}