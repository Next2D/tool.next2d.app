import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as screenDisplayObjectRegisterWindowEventUseCase } from "./ScreenDisplayObjectRegisterWindowEventUseCase";
import { $getMovePositon } from "../../../../tool/application/ToolUtil";

/**
 * @description スクリーンに設置したDisplayObject選択時のイベント処理関数
 *              Event processing function when DisplayObject is selected on the screen
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示
    $allHideMenu();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const layerId = parseInt(element.dataset.layerId as string);
    const layer = movieClip.getLayerById(layerId);
    if (!layer) {
        return ;
    }

    // 移動量のオブジェクトを初期化
    // fixed logic
    const movePosition = $getMovePositon();
    movePosition.x = 0;
    movePosition.y = 0;

    // 移動用のwindowイベントを登録
    // fixed logic
    screenDisplayObjectRegisterWindowEventUseCase();

    // レイヤーのインデックスを取得
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    const layerIndex = externalLayer.index;

    const depth = parseInt(element.dataset.depth as string);

    // 外部APIを起動
    const externalScreen = new ExternalScreen(workSpace, movieClip);
    if (!event.shiftKey) {

        // 選択中のDisplayObjectがある場合は選択処置はスキップ
        if (movieClip.selectedDepths.has(layerIndex)) {
            const depths = movieClip.selectedDepths.get(layerIndex) as NonNullable<number[]>;
            if (depths.indexOf(depth) > -1) {
                return ;
            }
        }

        // 選択処理を実行
        externalScreen.selectDisplayObjects(
            layerIndex,
            [depth],
            event.shiftKey
        );

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
            externalScreen.selectDisplayObjects(
                layerIndex,
                depths,
                event.shiftKey
            );
        } else {
            // 選択解除処理を実行
            externalScreen
                .deactivatedAllLayer(layerIndex);
        }
    }
};