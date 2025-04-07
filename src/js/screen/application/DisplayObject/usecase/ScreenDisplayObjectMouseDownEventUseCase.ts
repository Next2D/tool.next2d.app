import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as screenDisplayObjectRegisterPointerEventUseCase } from "./ScreenDisplayObjectRegisterPointerEventUseCase";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as referenceSettingHideElementService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingHideElementService";
import { execute as screenAreaCalcSelectedCharacterPositionService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService";
import { $setPointerId } from "../DisplayObjectUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description スクリーンに設置したDisplayObject選択時のイベント処理関数
 *              Event processing function when DisplayObject is selected on the screen
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // メニューを全て非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 中心点を非表示にする
    referenceSettingHideElementService();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const layerId = parseInt(element.dataset.layerId as string);
    const layer = movieClip.getLayerById(layerId);
    if (!layer) {
        return ;
    }

    // レイヤーのインデックスを取得
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    const layerIndex = externalLayer.index;

    const depth = parseInt(element.dataset.depth as string);

    // 外部APIを起動
    const externalScreen = new ExternalScreen(workSpace, movieClip);
    if (!event.shiftKey) {

        let doSelect = true;

        // 選択中のDisplayObjectがある場合は選択処置はスキップ
        if (movieClip.selectedDepths.has(layerIndex)) {
            const depths = movieClip.selectedDepths.get(layerIndex) as NonNullable<number[]>;
            if (depths.indexOf(depth) > -1) {
                doSelect = false;
            }
        }

        // 選択処理を実行
        if (doSelect) {
            await externalScreen.selectDisplayObjects(
                layerIndex,
                [depth],
                event.shiftKey
            );
        }

    } else {
        const depths = movieClip.selectedDepths.has(layerIndex)
            ? movieClip.selectedDepths.get(layerIndex) as NonNullable<number[]>
            : [];

        // 複数選択の場合、重複は削除、新規は追加
        const index = depths.indexOf(depth);
        if (index > -1) {
            depths.splice(index, 1);
        } else {
            depths.push(depth);
        }

        if (depths.length) {
            // 選択処理を実行
            await externalScreen.selectDisplayObjects(
                layerIndex,
                depths,
                event.shiftKey
            );
        } else {
            // 選択解除処理を実行
            await externalScreen
                .deactivatedAllLayer(layerIndex);
        }
    }

    const position = screenAreaCalcSelectedCharacterPositionService(movieClip);
    if (!position) {
        return ;
    }

    // 移動量のオブジェクトを初期化
    transformSetting.x = 0;
    transformSetting.y = 0;

    // 移動前の座標を保存
    transformSetting.tempPosition.x = position.x;
    transformSetting.tempPosition.y = position.y;

    $setPointerId(event.pointerId);

    // 移動用のwindowイベントを登録
    // fixed logic
    screenDisplayObjectRegisterPointerEventUseCase(event);
};