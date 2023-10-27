import { $SCREEN_TAB_AREA_ID, $SCREEN_TAB_MENU_NAME_LIST_ID } from "../../../../config/ScreenConfig";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { execute as screenTabComponent } from "../component/ScreenTabComponent";
import { execute as screenTabNameListComponent } from "../component/ScreenTabNameListComponent";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as detailModalRegisterFadeEventService } from "../../../../menu/application/DetailModal/service/DetailModalRegisterFadeEventService";
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
        .getElementById($SCREEN_TAB_AREA_ID);

    if (!element) {
        return ;
    }

    element
        .insertAdjacentHTML("beforeend",
            screenTabComponent(work_space.id, work_space.name)
        );

    // タブ一覧にElementを追加
    const listElement: HTMLElement | null = document
        .getElementById($SCREEN_TAB_MENU_NAME_LIST_ID);

    if (!listElement) {
        return ;
    }

    listElement
        .insertAdjacentHTML("beforeend",
            screenTabNameListComponent(work_space.id, work_space.name)
        );

    const tabElement: HTMLElement | null = screenTabGetElementService(work_space.id);
    if (!tabElement) {
        return ;
    }

    // タブElementの説明文をモーダルで表示できるようイベントを登録する
    detailModalRegisterFadeEventService(tabElement);

    // 動作イベントの登録
    screenTabInitializeRegisterEventUseCase(work_space);
};