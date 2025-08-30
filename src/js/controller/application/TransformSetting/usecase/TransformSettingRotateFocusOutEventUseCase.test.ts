import { execute } from "./TransformSettingRotateFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingRotateFocusOutEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.selectedDepths.set(0, [0]);

        const input = document.createElement("input");
        input.value = "200";

        let stopPropagation = false;
        const mockEvent = {
            target: input,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as FocusEvent;

        // reset
        transformSetting.clear();
        transformSetting.sizeLocked = true;
        transformSetting.beforeHeight = 100;
        transformSetting.beforeWidth = 100;
        $updateKeyLock(true);

        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(true);
        await execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(false);
    });
});