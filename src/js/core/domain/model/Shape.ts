import type { IObject } from "@/interface/IObject";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { IBounds } from "@/interface/IBounds";
import type { IShapePublishJson } from "@/interface/IShapePublishJson";
import type { Character } from "./Character";
import { execute as shapeCreateCanvasElementService } from "@/core/application/Shape/service/ShapeCreateCanvasElementService";
import { execute as shapeCreateJsonService } from "@/core/application/Shape/service/ShapeCreateJsonService";
import { Instance } from "./Instance";

/**
 * @description ベクター管理クラス
 *              Vector management class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Shape extends Instance
{
    /**
     * @description 描画レコードの配列
     *              Array of drawing records
     *
     * @member {array}
     * @readonly
     * @public
     */
    public readonly recodes: any[];

    /**
     * @description バウンディングボックス
     *              Bounding box
     *
     * @member {IBounds}
     * @readonly
     * @public
     */
    public readonly bounds: IBounds;

    /**
     * @description ビットマップ化フラグ
     *              Bitmap flag
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    public inBitmap: boolean;

    /**
     * @param {IObject<IShapeSaveObject>} object
     * @constructor
     * @public
     */
    constructor (object: IObject<IShapeSaveObject>)
    {
        super(object);

        this.recodes  = [];
        this.inBitmap = object.inBitmap ? object.inBitmap : false;
        this.bounds   = {
            "xMin": 0,
            "xMax": 0,
            "yMin": 0,
            "yMax": 0
        };

        if (object.recodes) {
            this.convertToObjectFromRecode(object.recodes);
        }

        if (object.bounds) {
            this.bounds.xMin = object.bounds.xMin;
            this.bounds.yMin = object.bounds.yMin;
            this.bounds.xMax = object.bounds.xMax;
            this.bounds.yMax = object.bounds.yMax;
        }
    }

    /**
     * @description Shapeの情報をNext2D Playerの再生用JSONオブジェクトに変換
     *              Convert Shape information to a JSON object for playback in Next2D Player
     *
     * @return {IShapePublishJson}
     * @method
     * @public
     */
    toPublish (): IShapePublishJson
    {
        return shapeCreateJsonService(this);
    }

    /**
     * @description HTMLCanvasElementを返却
     *              Return HTMLCanvasElement
     *
     * @param  {Character} character
     * @return {Promise<HTMLCanvasElement>}
     * @method
     * @public
     */
    async getHTMLElement (character: Character | null = null): Promise<HTMLCanvasElement>
    {
        return await shapeCreateCanvasElementService(this, character);
    }

    /**
     * @description プレーンなバウンディングボックスを返す
     *              Returns the plain bounding box of the image
     *
     * @return {IBounds}
     * @method
     * @public
     */
    getRawBounds (): IBounds
    {
        return this.bounds;
    }

    /**
     * @description Shapeの描画レコードを保存用のObjectに変換
     *              Convert the drawing records of Shape to an Object for saving
     *
     * @return {array}
     * @method
     * @public
     */
    convertToRecodeFromObject (): any[]
    {
        if (!this.inBitmap) {
            return this.recodes.slice();
        }

        const recodes = [];
        for (let idx = 0; this.recodes.length > idx; ++idx) {

            const value = this.recodes[idx];
            recodes[idx] = value;

            if (typeof value !== "object") {
                continue;
            }

            if (!("buffer" in value)) {
                continue;
            }

            recodes[idx] = {
                "buffer": Array.from(value.buffer),
                "width": value.width,
                "height": value.height
            };
        }

        return recodes;
    }

    /**
     * @description 保存用のObjectからShapeの描画レコードに変換
     *              Convert the drawing records of Shape from an Object for saving
     *
     * @param  {array} values
     * @return {void}
     * @method
     * @public
     */
    convertToObjectFromRecode (values: any[]): void
    {
        this.recodes.length = 0;
        this.recodes.push(...values);
        if (this.inBitmap) {
            // todo
        }
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {IShapeSaveObject}
     * @method
     * @public
     */
    toObject (): IShapeSaveObject
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "inBitmap": this.inBitmap,
            "recodes":  this.convertToRecodeFromObject(),
            "bounds":   this.getRawBounds()
        };
    }
}