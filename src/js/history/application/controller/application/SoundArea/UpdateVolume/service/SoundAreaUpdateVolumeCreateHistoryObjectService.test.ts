import { execute } from "./SoundAreaUpdateVolumeCreateHistoryObjectService";
import { $SOUND_AREA_UPDATE_VOLUME_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import type { SoundObjectImpl } from "../../../../../../../interface/SoundObjectImpl";

describe("SoundAreaUpdateVolumeCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const soundObject: SoundObjectImpl = {
            "libraryId": 2,
            "volume": 100,
            "autoPlay": false,
            "loopCount": 0
        };

        const object = execute(1, movieClip, soundObject, 10, 0, 50, "sound_01");
        expect(object.command).toBe($SOUND_AREA_UPDATE_VOLUME_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(7);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2].libraryId).toBe(2);
        expect(object.messages[3]).toBe(10);
        expect(object.messages[4]).toBe(0);
        expect(object.messages[5]).toBe(50);
        expect(object.messages[6]).toBe(100);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(10);
        expect(object.args[2]).toBe("sound_01");
    });
});