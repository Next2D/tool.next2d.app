import { execute } from "./SoundAreaRebuildSelectElementService";
import { $SOUND_AREA_SELECT_ID } from "../../../../config/SoundSettingConfig";
import { Sound } from "../../../../core/domain/model/Sound";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("SoundAreaRebuildSelectElementServiceTest", () =>
{
    it("test case", () =>
    {
        const select = document.createElement("select");
        select.id = $SOUND_AREA_SELECT_ID;
        document.body.appendChild(select);

        select.appendChild(document.createElement("option"));
        select.appendChild(document.createElement("option"));
        select.appendChild(document.createElement("option"));
        const sound = new Sound({
            "id": 1,
            "type": "sound",
            "name": "Sound_01"
        });

        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.libraries.set(1, sound);

        expect(select.children.length).toBe(3);
        execute();
        expect(select.children.length).toBe(1);

        select.remove();
        workSpace.libraries.delete(1);
    });
});