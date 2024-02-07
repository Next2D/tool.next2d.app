import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Instance } from "@/core/domain/model/Instance";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaInacticeInstanceTextContentService } from "../service/LibraryAreaInacticeInstanceTextContentService";
import { ExternalItem } from "@/external/core/domain/model/ExternalItem";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { $ERROR_DUPLICATE_NAME_TEXT } from "@/config/ErrorTextConfig";

/**
 * @description インスタンスのシンボルエリアのダブルタップ処理関数
 *              Double-tap processing function for the symbol area of an instance
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // 編集モードをoffにする
    libraryAreaInacticeInstanceTextContentService(event);

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

    // 変更がなければ終了
    const symbol = element.textContent as string;
    if (symbol === instance.symbol) {
        return ;
    }

    // 重複していればエラーを表示
    if (workSpace.pathMap.has(symbol)) {

        // 元の名前に戻す
        element.textContent = instance.symbol;

        // エラーを表示
        detailModalCustomFadeInUseCase(
            $ERROR_DUPLICATE_NAME_TEXT,
            element.offsetLeft,
            element.offsetTop - element.clientHeight - 4
        );

        return ;
    }

    // 外部APIを起動
    const externalItem = new ExternalItem(workSpace, instance);
    externalItem.symbol = symbol;
};