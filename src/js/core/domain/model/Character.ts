import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import type { IExternalItem } from "@/interface/IExternalItem";
import type { IBlendMode } from "@/interface/IBlendMode";
import type { Layer } from "./Layer";
import type { IBounds } from "@/interface/IBounds";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterCreateElementUseCase } from "@/core/application/Character/usecase/CharacterCreateElementUseCase";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcSetScaleXUseCase } from "@/core/application/Character/usecase/CharacterCalcSetScaleXUseCase";
import { execute as characterCalcSetScaleYService } from "@/core/application/Character/usecase/CharacterCalcSetScaleYUseCase";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcSetRotationService } from "@/core/application/Character/service/CharacterCalcSetRotationService";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";
import { execute as characterGetRawBoundsService } from "@/core/application/Character/service/CharacterGetRawBoundsService";
import { execute as characterGetBoundsService } from "@/core/application/Character/service/CharacterGetBoundsService";
import { execute as characterLoadService } from "@/core/application/Character/service/CharacterLoadService";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $clamp } from "@/global/GlobalUtil";
import { ReferencePosition } from "./ReferencePosition";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

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
    public referencePosition: ReferencePosition;

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

    /**
     * @description 親MovieClipのID
     *              Parent MovieClip ID
     *
     * @member {number}
     * @public
     */
    public parentMovieClipId: number;

    /**
     * @description 親CharacterのID
     *              Parent Character ID
     *
     * @member {number}
     * @public
     */
    public parentCharacterId: number;

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

        // 継承用ID
        this.parentMovieClipId = -1;
        this.parentCharacterId = -1;

        this.filters = [];
        this.referencePosition = new ReferencePosition(this);
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
        let cacheKey = `${this.id}@`;

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
        this.matrix[4] = Math.round(x * 100) / 100;
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
        this.matrix[5] =  Math.round(y * 100) / 100;
    }

    /**
     * @description 幅を返却
     *              Return width
     *
     * @member {number}
     * @public
     * @readonly
     */
    get width (): number
    {
        const bounds = this.getBounds();
        return bounds
            ? Math.round(Math.abs(bounds.xMax - bounds.xMin) * 100) / 100
            : 0;
    }

    /**
     * @description 高さを返却
     *              Return height
     *
     * @member {number}
     * @public
     * @readonly
     */
    get height (): number
    {
        const bounds = this.getBounds();
        return bounds
            ? Math.round(Math.abs(bounds.yMax - bounds.yMin) * 100) / 100
            : 0;
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
        return characterCalcGetScaleXService(this.matrix);
    }
    set scaleX (scale_x: number)
    {
        characterCalcSetScaleXUseCase(scale_x, this.matrix);
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
        return characterCalcGetScaleYService(this.matrix);
    }
    set scaleY (scale_y: number)
    {
        characterCalcSetScaleYService(scale_y, this.matrix);
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
        return characterCalcGetRotationService(this.matrix);
    }
    set rotation (rotation: number)
    {
        characterCalcSetRotationService(rotation, this.matrix);
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
        characterLoadService(this, save_object);
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
     * @param  {boolean} [use_parent_matrix=false]
     * @return {object}
     * @method
     * @public
     */
    getBounds (frame: number = 1, use_parent_matrix: boolean = false): IBounds | null
    {
        return characterGetBoundsService(this, frame, use_parent_matrix);
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
        return characterGetRawBoundsService($getCurrentWorkSpace(), this, frame);
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
            "parentCharacterId": this.parentCharacterId,
            "parentMovieClipId": this.parentMovieClipId,
            "referencePosition": this.referencePosition.toObject()
        };
    }
}