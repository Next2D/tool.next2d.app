import { $VIEW_TAB_AREA_ID } from "../../../../config/ViewConfig";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { execute as screenTabComponent } from "../component/ScreenTabComponent";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as screenTabRegisterFadeEventService } from "../service/ScreenTabRegisterFadeEventService";
import { execute as screenTabInitializeRegisterEventUseCase } from "../usecase/ScreenTabInitializeRegisterEventUseCase";

/**
 * @description 初期起動ユースケース
 *              Initial startup use case
 *
 * @params {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): void =>
{
    // タブのElementを追加
    const element: HTMLElement | null = document
        .getElementById($VIEW_TAB_AREA_ID);

    if (!element) {
        return ;
    }

    element
        .insertAdjacentHTML("beforeend",
            screenTabComponent(work_space.id, work_space.name)
        );

    const tabElement: HTMLElement | null = screenTabGetElementService(work_space.id);
    if (!tabElement) {
        return ;
    }

    // タブElementの説明文をモーダルで表示できるようイベントを登録する
    screenTabRegisterFadeEventService(tabElement);

    // 動作イベントの登録
    screenTabInitializeRegisterEventUseCase(work_space);
};