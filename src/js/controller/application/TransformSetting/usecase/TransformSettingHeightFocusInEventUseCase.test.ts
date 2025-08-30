import { execute } from "./TransformSettingHeightFocusInEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingHeightFocusInEventUseCase Test", () =>
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

        expect(transformSetting.beforeHeight).toBe(0);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(mockEvent);
        expect(transformSetting.beforeHeight).toBe(100);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });

    it("execute test case2", () =>
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

        const widthInput = document.createElement("input");
        widthInput.value = "200";
        widthInput.id = $TRANSFORM_OBJECT_WIDTH_ID;
        document.body.appendChild(widthInput);

        // reset
        transformSetting.clear();
        $updateKeyLock(false);
        transformSetting.sizeLocked = true;

        expect(transformSetting.beforeWidth).toBe(0);
        expect(transformSetting.beforeHeight).toBe(0);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(mockEvent);
         expect(transformSetting.beforeWidth).toBe(200);
        expect(transformSetting.beforeHeight).toBe(100);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);

        widthInput.remove();
    });
});