import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import type { IExternalItem } from "@/interface/IExternalItem";
import type { IBlendMode } from "@/interface/IBlendMode";
import type { Layer } from "./Layer";
import type { IBounds } from "@/interface/IBounds";
import type { IPosition } from "@/interface/IPosition";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterCreateElementUseCase } from "@/core/application/Character/usecase/CharacterCreateElementUseCase";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcSetScaleXService } from "@/core/application/Character/service/CharacterCalcSetScaleXService";
import { execute as characterCalcSetScaleYService } from "@/core/application/Character/service/CharacterCalcSetScaleYService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcSetRotationService } from "@/core/application/Character/service/CharacterCalcSetRotationService";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $clamp } from "@/global/GlobalUtil";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";
import {
    $getCurrentWorkSpace,
    $getMatrixBounds
} from "@/core/application/CoreUtil";

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
    /**
     * @description CharacterのユニークID
     *             Unique ID of Character
     *
     * @member {number}
     * @public
     * @readonly
     */
    public readonly id: number;

    /**
     * @description 開始フレーム番号
     *              start frame number
     *
     * @member {number}
     * @public
     */
    public startFrame: number;

    /**
     * @description 終了フレーム番号
     *              end frame number
     *
     * @member {number}
     * @public
     */
    public endFrame: number;

    /**
     * @description ライブラリに読み込まれたアイテムID
     *              Item ID loaded in the library
     *
     * @member {number}
     * @public
     */
    public libraryId: number;

    /**
     * @description 表示順の深さ(昇順)
     *              Depth of display order (ascending)
     *
     * @member {number}
     * @public
     */
    public depth: number;

    /**
     * @description matrix情報
     *              Matrix information
     *
     * @member {Float32Array}
     * @readonly
     * @public
     */
    public readonly matrix: Float32Array;

    /**
     * @description colorTransform情報
     *              ColorTransform information
     *
     * @member {Float32Array}
     * @readonly
     * @public
     */
    public readonly colorTransform: Float32Array;

    /**
     * @description 中心点の座標
     *              Center point coordinates
     *
     * @member {IPosition}
     * @public
     */
    public referencePosition: IPosition;

    /**
     * @description フィルターの配列を返却
     *              Return an array of filters
     *
     * @member {array}
     * @readonly
     * @public
     */
    public readonly filters: any[];

    /**
     * @description ブレンドモード
     *              Blend mode
     *
     * @member {string}
     * @public
     */
    public blendMode: IBlendMode;

    /**
     * @description MovieClip内で有効なアクセス名
     *              Valid access name in MovieClip
     *
     * @member {string}
     * @public
     */
    public name: string;

    private _$scaleX: number | null;
    private _$scaleY: number | null;
    private _$rotation: number | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.id             = $characterId++;
        this.libraryId      = -1;
        this.depth          = 0;
        this.name           = "";
        this.matrix         = new Float32Array([1, 0, 0, 1, 0, 0]);
        this.colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        this.blendMode      = "normal";
        this.startFrame     = 0;
        this.endFrame       = 0;

        this.filters = [];
        this.referencePosition = {
            "x": 0,
            "y": 0
        };

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
     * @description キャッシュキーを返却
     *              Return cache key
     *
     * @member {string}
     * @public
     */
    get cacheKey (): string
    {
        let cacheKey = "@";

        // colorTransformがデフォルト値以外の場合はキャッシュキーに追加
        switch (true) {

            case this.colorTransform[0] !== 1:
            case this.colorTransform[1] !== 1:
            case this.colorTransform[2] !== 1:
            case this.colorTransform[4] !== 0:
            case this.colorTransform[5] !== 0:
            case this.colorTransform[6] !== 0:
                {
                    const r = Math.max(0, Math.min(255 * this.colorTransform[0] + this.colorTransform[4], 255));
                    const g = Math.max(0, Math.min(255 * this.colorTransform[1] + this.colorTransform[5], 255));
                    const b = Math.max(0, Math.min(255 * this.colorTransform[2] + this.colorTransform[6], 255));
                    cacheKey += `_${r}_${g}_${b}`;
                }
                break;

            default:
                break;

        }

        const workSpace = $getCurrentWorkSpace();
        const instance = workSpace.getLibrary(this.libraryId);
        if (!instance) {
            return cacheKey;
        }

        // BitmapとVideo以外はスケールの値をキャッシュキーに追加
        switch (instance.type) {

            case $BITMAP_TYPE:
            case $VIDEO_TYPE:
                break;

            default:
                {
                    const concatMatrix = $getConcatenatedMatrix();
                    const scaleX = Math.round(Math.sqrt(
                        concatMatrix[0] * concatMatrix[0]
                        + concatMatrix[1] * concatMatrix[1]
                    ) * 10000) / 10000;
                    const scaleY = Math.round(Math.sqrt(
                        concatMatrix[2] * concatMatrix[2]
                        + concatMatrix[3] * concatMatrix[3]
                    ) * 10000) / 10000;
                    cacheKey += `_${this.scaleX * scaleX}_${this.scaleY * scaleY}`;
                }
                break;

        }

        // TODO filters

        return cacheKey;
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
            this.colorTransform[3] + this.colorTransform[7] / 255, 0, 1
        );
    }

    /**
     * @description elemnt表示位置のx座標を返却
     *              Return x coordinate of elemnt display position
     *
     * @member {number}
     * @readonly
     * @public
     */
    get offsetX (): number
    {
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const bounds = this.getBounds(movieClip.currentFrame);
        return bounds ? bounds.xMin : 0;
    }

    /**
     * @description ローカル座標からグローバルのx座標を返却
     *              Return global x coordinate from local coordinates
     *
     * @member {number}
     * @readonly
     * @public
     */
    get globalMinX (): number
    {
        const calcBounds = this.getBounds();
        if (!calcBounds) {
            return 0;
        }

        const bounds = $getMatrixBounds(
            calcBounds.xMin,
            calcBounds.yMin,
            calcBounds.xMax,
            calcBounds.yMax,
            $getConcatenatedMatrix()
        );

        return bounds.xMin;
    }

    /**
     * @description ローカル座標からグローバルのy座標を返却
     *              Return global y coordinate from local coordinates
     *
     * @member {number}
     * @readonly
     * @public
     */
    get globalMinY (): number
    {
        const calcBounds = this.getBounds();
        if (!calcBounds) {
            return 0;
        }

        const bounds = $getMatrixBounds(
            calcBounds.xMin,
            calcBounds.yMin,
            calcBounds.xMax,
            calcBounds.yMax,
            $getConcatenatedMatrix()
        );

        return bounds.yMin;
    }

    /**
     * @description elemnt表示位置のx座標を返却
     *              Return x coordinate of elemnt display position
     *
     * @member {number}
     * @readonly
     * @public
     */
    get offsetY (): number
    {
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene as MovieClip;

        const bounds = this.getBounds(movieClip.currentFrame);
        return bounds ? bounds.yMin : 0;
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
        return this.matrix[4];
    }
    set x (x: number)
    {
        this.matrix[4] = Math.round(x * 10000) / 10000;
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
        return this.matrix[5];
    }
    set y (y: number)
    {
        this.matrix[5] =  Math.round(y * 10000) / 10000;
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
            ? Math.abs(bounds.xMax - bounds.xMin)
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
            ? Math.abs(bounds.yMax - bounds.yMin)
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
            this._$scaleX = characterCalcGetScaleXService(this.matrix);
        }
        return this._$scaleX;
    }
    set scaleX (scale_x: number)
    {
        this._$scaleX = characterCalcSetScaleXService(
            scale_x,
            this._$scaleX,
            this.matrix
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
            this._$scaleY = characterCalcGetScaleYService(this.matrix);
        }
        return this._$scaleY;
    }
    set scaleY (scale_y: number)
    {
        this._$scaleY = characterCalcSetScaleYService(
            scale_y,
            this._$scaleY,
            this.matrix
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
            this._$rotation = characterCalcGetRotationService(this.matrix);
        }
        return this._$rotation;
    }
    set rotation (rotation: number)
    {
        this._$rotation = characterCalcSetRotationService(
            rotation,
            this._$rotation,
            this.matrix
        );
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
        this.startFrame += move_frame;
        this.endFrame   += move_frame;
    }

    /**
     * @description セーブオブジェクトからrestore
     *              restore from save object
     *
     * @param {objct} save_object
     * @method
     * @public
     */
    load (save_object: ICharacterSaveObject): void
    {
        this.libraryId  = save_object.libraryId;
        this.depth      = save_object.depth;
        this.blendMode  = save_object.blendMode;
        this.startFrame = save_object.startFrame;
        this.endFrame   = save_object.endFrame;
        this.name       = save_object.name;

        // 配列を上書き
        if (save_object.matrix) {
            this.matrix.set(save_object.matrix);
        }
        if (save_object.colorTransform) {
            this.colorTransform.set(save_object.colorTransform);
        }

        // 中心点を上書き
        if (save_object.referencePosition) {
            this.referencePosition.x = save_object.referencePosition.x;
            this.referencePosition.y = save_object.referencePosition.y;
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
    loadExternalItem (item: IExternalItem<any>): void
    {
        this.libraryId = item.id;
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
     * @param  {number} [frame=1]
     * @return {object}
     * @method
     * @public
     */
    getBounds (frame: number = 1): IBounds | null
    {
        const bounds = this.getRawBounds(frame);
        return bounds ? $getMatrixBounds(
            bounds.xMin,
            bounds.yMin,
            bounds.xMax,
            bounds.yMax,
            this.matrix
        ) : null;
    }

    /**
     * @description matrixで加工しないバウンディングボックスを返却
     *              Return the bounding box that is not processed by matrix
     *
     * @pmaram {number} [frame=1]
     * @return {object}
     * @method
     * @public
     */
    getRawBounds (frame: number = 1): IBounds | null
    {
        const workSpace = $getCurrentWorkSpace();
        const instance  = workSpace.getLibrary(this.libraryId);
        if (!instance) {
            return null;
        }

        if (instance.type !== $MOVIE_CLIP_TYPE) {
            return instance.getRawBounds();
        }

        // MovieClipの場合は子孫のフレーム位置に合わせる
        const totalFrame = (instance as MovieClip).maxFrame - 1;
        const maxFrame = frame - this.startFrame + 1;

        let currentFrame = 0;
        for (let idx = 0; idx < maxFrame; ++idx) {
            ++currentFrame;
            if (totalFrame < currentFrame) {
                currentFrame = 1;
            }
        }

        return (instance as MovieClip).getRawBounds(currentFrame);
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): ICharacterSaveObject
    {
        return {
            "libraryId": this.libraryId,
            "depth": this.depth,
            "blendMode": this.blendMode,
            "matrix": Array.from(this.matrix),
            "colorTransform": Array.from(this.colorTransform),
            "startFrame": this.startFrame,
            "endFrame": this.endFrame,
            "name": this.name,
            "referencePosition": this.referencePosition
        };
    }
}