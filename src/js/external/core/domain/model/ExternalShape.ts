import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Graphics } from "@next2d/display";
import { ExternalItem } from "./ExternalItem";

/**
 * @description ベクターアイテムのクラス
 *              Vector Item Class
 *
 * @class
 * @public
 */
export class ExternalShape extends ExternalItem
{
    private _$graphics: Graphics;

    /**
     * @param {WorkSpace} work_space
     * @param {Instance} instance
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace, instance: InstanceImpl<any>)
    {
        super(work_space, instance);

        /**
         * @description Next2D Playerのグラフィックスクラス
         *              Next2D Player's Graphics Class
         *
         * @type {Graphics}
         */
        this._$graphics = new next2d.display.Graphics();
    }

    /**
     * @description Next2D Playerのグラフィックスクラス
     *              Next2D Player's Graphics Class
     *
     * @member {Graphics}
     * @readonly
     * @public
     */
    get graphics (): Graphics
    {
        return this._$graphics;
    }

    /**
     * @description グラフィックスの更新を適用
     *              Apply graphics update
     *
     * @return {Promise}
     * @method
     * @public
     */
    async applyGraphics (): Promise<void>
    {
        // 描画レコードを取得
        const recodes = this._$graphics._$getRecodes();

        // 描画レコードを更新
        this._$instance.recodes.length = 0;
        this._$instance.recodes.push(...Array.from(recodes));

        // 描画反映のバウンディングボックスを更新
        const bounds = this._$instance.getRawBounds();
        bounds.xMin = this._$graphics._$xMin;
        bounds.yMin = this._$graphics._$yMin;
        bounds.xMax = this._$graphics._$xMax;
        bounds.yMax = this._$graphics._$yMax;

        // 描画レコードをクリア
        this._$graphics.clear();
    }
}