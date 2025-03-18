import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description ショートカットリストの要素を選択処理
 *              Selective processing of elements in the shortcut list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 0
    ) {
        return;
    }

    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 選択されたElementのstyleを更新して、内部情報にセット
    const element: HTMLElement | null = event.target as HTMLElement;
    shortcutSettingMenuChangeListStyleService(element);
};