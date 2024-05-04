import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getSelectedMode } from "../../PropertyArea/PropertyAreaUtil";
import { ExternalItem } from "@/external/core/domain/model/ExternalItem";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { $ERROR_DUPLICATE_SYMBOL_TEXT } from "@/config/ErrorTextConfig";

/**
 * @description シンボルのフォーカスアウトイベント処理
 *              Focus out event processing of symbol
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOffにする
    $updateKeyLock(false);

    if ($getSelectedMode() !== "") {
        return ;
    }

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 変更がなければ終了
    const symbol = element.value;
    if (symbol === movieClip.symbol) {
        return ;
    }

    // 重複していればエラーを表示
    if (workSpace.symbolMap.has(symbol)) {

        // 元の名前に戻す
        element.value = movieClip.symbol;

        // エラーを表示
        detailModalCustomFadeInUseCase(
            $ERROR_DUPLICATE_SYMBOL_TEXT,
            element.offsetLeft,
            element.offsetTop - element.clientHeight - 4
        );

        return ;
    }

    // 外部APIを起動
    const externalItem = new ExternalItem(workSpace, movieClip);
    externalItem.symbol = symbol;
};