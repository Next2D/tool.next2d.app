import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Instance } from "@/core/domain/model/Instance";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaInacticeInstanceNameService } from "../service/LibraryAreaInacticeInstanceNameService";
import { ExternalItem } from "@/external/core/domain/model/ExternalItem";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { $ERROR_DUPLICATE_NAME_TEXT } from "@/config/ErrorTextConfig";

/**
 * @description インスタンスの名前エリアのダブルタップ処理関数
 *              Double-tap processing function for instance name area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // 編集モードをoffにする
    libraryAreaInacticeInstanceNameService(event);

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const libraryId = parseInt(element.dataset.libraryId as string);
    const workSpace = $getCurrentWorkSpace();
    const instance: InstanceImpl<Instance> | null = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    let name = element.textContent as string;
    if (!name) {
        element.textContent = name = instance.name;
    }

    // 変更がなければ終了
    if (name === instance.name) {
        return ;
    }

    // 重複していればエラーを表示
    const before  = instance.name;
    instance.name = name;
    if (workSpace.pathMap.has(instance.getPath(workSpace))) {

        // 元の名前に戻す
        element.textContent = instance.name = before;

        // エラーを表示
        detailModalCustomFadeInUseCase(
            $ERROR_DUPLICATE_NAME_TEXT,
            element.offsetLeft,
            element.offsetTop - element.clientHeight - 4
        );

        return ;
    }

    // 変更前に戻す
    // fixed logic
    instance.name = before;

    // 外部APIを起動
    const externalItem = new ExternalItem(workSpace, instance);
    externalItem.name = name;
};