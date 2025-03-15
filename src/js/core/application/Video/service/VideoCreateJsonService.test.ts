import { execute } from "./VideoCreateJsonService";
import { describe, expect, it } from "vitest";
import { Video } from "../../../../core/domain/model/Video";
import { Video as DisplayVideo } from "@next2d/media";
import { $VIDEO_TYPE } from "../../../../config/InstanceConfig";

describe("VideoCreateJsonService Test", () =>
{
    it("test case", () =>
    {
        const video = new Video({
            "id": 1,
            "type": $VIDEO_TYPE,
            "buffer": [],
            "width": 100,
            "height": 200,
            "volume": 0.5,
            "loop": true,
            "autoPlay": false,
            "symbol": "symbol"
        });

        const object = execute(video)
        expect(object.extends).toBe(DisplayVideo.namespace);
        expect(object.buffer.length).toBe(0);
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.xMax).toBe(100);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.yMax).toBe(200);
        expect(object.symbol).toBe("symbol");
        expect(object.volume).toBe(0.5);
        expect(object.loop).toBe(true);
        expect(object.autoPlay).toBe(false);
    });
});