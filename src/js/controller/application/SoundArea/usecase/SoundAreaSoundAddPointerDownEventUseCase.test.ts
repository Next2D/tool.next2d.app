import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import { execute } from "./SoundAreaSoundAddPointerDownEventUseCase";
import { Sound } from "../../../../core/domain/model/Sound";
import { $SOUND_AREA_SELECT_ID } from "../../../../config/SoundSettingConfig";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it, vi } from "vitest";
import { timelineHeader } from "../../../../timeline/domain/model/TimelineHeader";

describe("SoundAreaSoundAddPointerDownEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        

        const sound = new Sound({
            "id": 2,
            "name": "Sound",
            "path": "path",
            "type": "sound",
            "volume": 1,
            "loop": false
        });

        workSpace.libraries.set(sound.id, sound);
        workSpace.pathMap.set(sound.getPath(workSpace), sound.id);

        const select = document.createElement("select");
        select.id = $SOUND_AREA_SELECT_ID;
        document.body.appendChild(select);

        const option = document.createElement("option");
        option.value = "2";
        option.text = "Sound";
        option.selected = true;
        select.appendChild(option);

        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0
        } as unknown as PointerEvent;

        const movieClip = workSpace.scene as MovieClip;
        movieClip.deleteSound(movieClip.currentFrame);
        expect(movieClip.hasSound(movieClip.currentFrame)).toBe(false);
        expect(stopPropagation).toBe(false);

        await execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(movieClip.hasSound(movieClip.currentFrame)).toBe(true);

        workSpace.libraries.delete(sound.id);
        workSpace.pathMap.delete(sound.getPath(workSpace));
        select.remove();
    });

    it("execute test case2", async () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0
        } as unknown as PointerEvent;
    
        timelineHeader.stopFlag = false;
        expect(stopPropagation).toBe(false);

        await execute(mockEvent);

        timelineHeader.stopFlag = true;
        expect(stopPropagation).toBe(false);
    });
});