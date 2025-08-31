import { execute } from "./TransformSettingYFocusInEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingYFocusInEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.selectedDepths.set(0, [0]);

        const input = document.createElement("input");
        input.value = "100";

        let stopPropagation = false;
        const mockEvent = {
            currentTarget: input,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as FocusEvent;

        // reset
        transformSetting.clear();
        $updateKeyLock(false);

        expect(transformSetting.beforeY).toBe(0);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(mockEvent);
        expect(transformSetting.beforeY).toBe(100);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});