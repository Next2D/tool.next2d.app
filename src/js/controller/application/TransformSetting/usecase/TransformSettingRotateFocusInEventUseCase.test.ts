import { execute } from "./TransformSettingRotateFocusInEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingRotateFocusInEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.selectedDepths.set(0, [0]);

        const input = document.createElement("input");
        input.value = "45";

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

        expect(transformSetting.rotation).toBe(0);
        expect(transformSetting.beforeRotation).toBe(0);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);

        execute(mockEvent);

        expect(transformSetting.rotation).toBe(45);
        expect(transformSetting.beforeRotation).toBe(45);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});