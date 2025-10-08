import { execute } from "./TransformSettingXFocusInEventUseCase";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingXFocusInEventUseCase Test", () =>
{
    let workSpace: WorkSpace;
    let yInput: HTMLInputElement;

    beforeEach(() => {
        // Y座標の入力要素を作成してDOMに追加
        yInput = document.createElement("input");
        yInput.id = "object-y";
        yInput.value = "200";
        document.body.appendChild(yInput);

        workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.selectedDepths.set(0, [0]);

        // reset
        transformSetting.clear();
        $updateKeyLock(false);
    });

    afterEach(() => {
        if (yInput.parentNode) {
            document.body.removeChild(yInput);
        }
    });

    it("execute test case1", () =>
    {
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

        expect(transformSetting.beforeX).toBe(0);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(mockEvent);
        expect(transformSetting.beforeX).toBe(100);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});