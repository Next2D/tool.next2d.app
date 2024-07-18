import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Shape } from "@/core/domain/model/Shape";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as screenDisplayObjectChangeElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectChangeElementUseCase";

/**
 * @description Shapeの描画レコード更新処理のUndo関数
 *              Undo function of Shape drawing record update processing
 *
 * @param  {number} work_space_id
 * @param  {object} before_shape_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    before_shape_object: ShapeSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);
    if (!element) {
        return ;
    }

    // 更新前のShapeを生成
    const shape = new Shape(before_shape_object);

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, shape);

    if (workSpace.active) {
        // 配置されてるDisplayObjectのElementを入れ替える
        await screenDisplayObjectChangeElementUseCase(shape.id);
    }
};