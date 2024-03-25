import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { LayerTypeImpl } from "@/interface/LayerTypeImpl";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";
import { execute as externalLayerUpdateLockUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateLockUseCase";
import { execute as externalLayerUpdateDisableUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateDisableUseCase";
import { execute as externalLayerUpdateLightUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateLightUseCase";
import { execute as externalLayerUpdateLightColorUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateLightColorUseCase";
import { execute as externalLayerUpdateTypeUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateTypeUseCase";
import { execute as externalLayerGetLayerTypeService } from "@/external/core/application/ExternalLayer/service/ExternalLayerGetLayerTypeService";

/**
 * @description Layerの外部APIクラス
 *              Layer external API classes
 * @class
 */
export class ExternalLayer
{
    private readonly _$layer: Layer;
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {Layer} layer
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip,
        layer: Layer
    ) {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;

        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;
    }

    /**
     * @description レイヤー名を返却
     *              Layer name returned
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$layer.name;
    }
    set name (name: string)
    {
        if (!name) {
            name = "Layer";
        }

        // 変更がなければ終了
        if (this._$layer.name === name) {
            return ;
        }

        // レイヤー名を更新
        externalLayerUpdateNameUseCase(
            this._$workSpace, this._$movieClip, this._$layer, name
        );
    }

    /**
     * @description レイヤーの階層番号を返却
     *              Layer hierarchy number returned
     *
     * @return {number}
     * @readonly
     * @public
     */
    get index (): number
    {
        return this._$movieClip.layers.indexOf(this._$layer);
    }

    /**
     * @description レイヤーが選択中か判定
     *              Determines if a layer is currently selected.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isSelected (): boolean
    {
        return this._$movieClip.selectedLayers.indexOf(this._$layer) > -1;
    }

    /**
     * @description レイヤーロックの状態を返却
     *              Layer lock status returned
     *
     * @default false
     * @return {boolean}
     * @method
     * @public
     */
    getLock (): boolean
    {
        return this._$layer.lock;
    }

    /**
     * @description レイヤーロックの値を更新
     *              Update Layer Lock value
     *
     * @param  {boolean} lock
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    setLock (lock: boolean, receiver: boolean = false): void
    {
        externalLayerUpdateLockUseCase(
            this._$workSpace, this._$movieClip, this._$layer, lock, receiver
        );
    }

    /**
     * @description レイヤー表示状態を返却
     *              Layer display status returned
     *
     * @default false
     * @return {boolean}
     * @method
     * @public
     */
    getDisable (): boolean
    {
        return this._$layer.disable;
    }

    /**
     * @description レイヤー表示の値を更新
     *              Update Layer Display Values
     *
     * @param  {boolean} disable
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    setDisable (disable: boolean, receiver: boolean = false): void
    {
        externalLayerUpdateDisableUseCase(
            this._$workSpace, this._$movieClip, this._$layer, disable, receiver
        );
    }

    /**
     * @description レイヤーハイライトの状態を返却
     *              Layer highlight status returned
     *
     * @default false
     * @return {boolean}
     * @method
     * @public
     */
    getLight (): boolean
    {
        return this._$layer.light;
    }

    /**
     * @description レイヤーハイライトの値を更新
     *              Update Layer Highlight values
     *
     * @param  {boolean} light
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    setLight (light: boolean, receiver: boolean = false): void
    {
        externalLayerUpdateLightUseCase(
            this._$workSpace, this._$movieClip, this._$layer, light, receiver
        );
    }

    /**
     * @description レイヤーハイライトの色を更新
     *              Update Layer Highlight Color
     *
     * @param  {string} color
     * @return {void}
     * @method
     * @public
     */
    updateLightColor (color: string): void
    {
        externalLayerUpdateLightColorUseCase(
            this._$workSpace, this._$movieClip, this._$layer, color
        );
    }

    /**
     * @description レイヤータイプを文字列で返却
     *              Returns the layer type as a string
     *
     * @mwmbwe {string}
     * @method
     * @public
     */
    get layerType (): LayerTypeImpl
    {
        return externalLayerGetLayerTypeService(this._$layer.mode);
    }
    set layerType (type: LayerTypeImpl)
    {
        externalLayerUpdateTypeUseCase(
            this._$workSpace, this._$movieClip, this._$layer, type
        );
    }
}