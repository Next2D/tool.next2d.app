import { execute } from "./SoundAreaVolumeFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("SoundAreaVolumeFocusOutEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        const soundObject = {
            libraryId: 2,
            volume: 100,
            autoPlay: false,
            loopCount: 0
        };
    
        movieClip.setSound(movieClip.currentFrame, soundObject);
        const input = document.createElement("input");
        input.dataset.index = "0";
        input.value = "1";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "currentTarget": input
        } as unknown as FocusEvent;

        $updateKeyLock(true);
        expect($useKeyboard()).toBe(true);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(soundObject.volume).toBe(100);

        await execute(mockEvent);

        expect($useKeyboard()).toBe(false);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(soundObject.volume).toBe(1);
    });
});