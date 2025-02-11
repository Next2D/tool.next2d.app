import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { IBounds } from "@/interface/IBounds";
import type { Shape } from "@/core/domain/model/Shape";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalShapeUpdateService } from "@/external/core/application/ExternalShape/service/ExternalShapeUpdateService";
import { execute as screenDisplayObjectChangeElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectChangeElementUseCase";

/**
 * @description 新規Shape追加処理のRedo関数
 *              Redo function for new Shape addition process
 *
 * @param  {number} work_space_id
 * @param  {object} before_shape_object
 * @param  {array} recodes
 * @param  {object} bounds
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    before_shape_object: IShapeSaveObject,
    recodes: number[],
    bounds: IBounds
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const shape = workSpace.getLibrary(before_shape_object.id) as Shape;
    if (!shape) {
        return ;
    }

    // Shapeの描画レコードを更新
    externalShapeUpdateService(
        shape,
        recodes,
        bounds
    );

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {
        // 配置されてるDisplayObjectのElementを入れ替える
        await screenDisplayObjectChangeElementUseCase(shape.id);
    }
};