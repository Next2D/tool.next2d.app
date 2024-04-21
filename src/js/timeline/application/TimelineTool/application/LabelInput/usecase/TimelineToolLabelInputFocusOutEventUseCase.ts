import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ラベルInputのフォーカスアウトイベント
 *              Label Input Focus Out Event
 *
 * @param {FocusEvent} event
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

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(
        workSpace,
        movieClip
    );

    // ラベル名を更新
    externalTimeline.label = element.value;
};