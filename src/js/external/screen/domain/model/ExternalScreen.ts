import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalScreenClaerSelectedDisplayObjectUseCase } from "@/external/screen/application/ExternalScreen/usecase/ExternalScreenClaerSelectedDisplayObjectUseCase";
import { execute as externalScreenSelectDisplayObjectUseCase } from "@/external/screen/application/ExternalScreen/usecase/ExternalScreenSelectDisplayObjectUseCase";
import { execute as externalTimelineLayerControllerSelectedLayersUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerSelectedLayersUseCase";
import { execute as externalScreenDeactivatedAllLayerUseCase } from "@/external/screen/application/ExternalScreen/usecase/ExternalScreenDeactivatedAllLayerUseCase";
import { execute as externalTimelineLayerDeactivatedAllLayerUseCase } from "@/external/timeline/application/ExternalTimelineLayer/usecase/ExternalTimelineLayerDeactivatedAllLayerUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as propertyAreaShowDefaultSettingItemUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaShowDefaultSettingItemUseCase";

/**
 * @description スクリーン操作の管理クラス
 *              Management class for screen operation
 *
 * @class
 * @public
 */
export class ExternalScreen
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
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
    }

    /**
     * @description 選択されているDisplayObjectをクリア
     *              Clear the selected DisplayObject
     *
     * @return {void}
     * @method
     * @public
     */
    claerSelectedDisplayObjects (): void
    {
        externalScreenClaerSelectedDisplayObjectUseCase(
            this._$workSpace,
            this._$movieClip
        );
    }

    /**
     * @description 指定したレイヤーのDisplayObjectを選択
     *              Select the display object of the specified layer
     *
     * @param  {number} layer_index
     * @param  {array} depths
     * @param  {boolean} [multi_select=false]
     * @return {void}
     * @method
     * @public
     */
    selectDisplayObjects (
        layer_index: number,
        depths: number[],
        multi_select: boolean = false
    ): void {

        // 単一選択なら選択を解除
        if (!multi_select) {
            this.claerSelectedDisplayObjects();
        }

        // 選択中のDisplayObjectのレイヤーを全て非アクティブにする
        externalTimelineLayerDeactivatedAllLayerUseCase(
            this._$workSpace,
            this._$movieClip
        );

        // 引数のDisplayObjectを選択状態に更新
        externalScreenSelectDisplayObjectUseCase(
            this._$workSpace,
            this._$movieClip,
            layer_index,
            depths
        );

        // 選択したDisplayObjectのレイヤーをアクティブにする
        externalTimelineLayerControllerSelectedLayersUseCase(
            this._$workSpace,
            this._$movieClip,
            Array.from(this._$movieClip.selectedDepths.keys())
        );
    }

    /**
     * @description 指定したレイヤーのDisplayObjectの選択を全て解除
     *              Deselect all DisplayObjects on the specified layer
     *
     * @param  {number} layer_index
     * @return {void}
     * @method
     * @public
     */
    deactivatedAllLayer (layer_index: number): void
    {
        // 選択中のDisplayObjectのレイヤーを全て非アクティブにする
        externalTimelineLayerDeactivatedAllLayerUseCase(
            this._$workSpace,
            this._$movieClip
        );

        // 指定のレイヤーのDisplayObjectの選択を全て解除
        externalScreenDeactivatedAllLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            layer_index
        );

        if (this._$movieClip.selectedDepths.size) {
            // 選択中のDisplayObjectのレイヤーをアクティブにする
            externalTimelineLayerControllerSelectedLayersUseCase(
                this._$workSpace,
                this._$movieClip,
                Array.from(this._$movieClip.selectedDepths.keys())
            );

            // プロパティエリアの表示を変更
            propertyAreaChangeDisplayUseCase();
        } else {
            // 未選択なら初期表示に切り替える
            propertyAreaShowDefaultSettingItemUseCase(this._$movieClip);
        }
    }
}