import { execute } from "./TransformSettingYFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingYFocusOutEventUseCase Test", () =>
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
        transformSetting.y = 100;
        $updateKeyLock(true);

        expect(stopPropagation).toBe(false);
        expect(transformSetting.y).toBe(100);
        expect($useKeyboard()).toBe(true);
        await execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(transformSetting.y).toBe(200);
        expect($useKeyboard()).toBe(false);
    });
});