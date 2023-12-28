import { execute } from "./TimelineScrollUpdateHeightService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $TIMELINE_SCROLL_BAR_Y_ID } from "../../../../config/TimelineConfig";

describe("TimelineScrollUpdateHeightServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);

        div.id = $TIMELINE_SCROLL_BAR_Y_ID;
        div.style.display = "none";

        timelineLayer.clientHeight = 200;

        const scene: MovieClip = $createWorkSpace().scene;

        for (let idx = 0; idx < 10; ++idx) {
            scene.setLayer(scene.createLayer(), scene.layers.length);
        }

        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-height",
                "100px"
            );

        scene.scrollY = 10000;
        expect(div.style.display).toBe("none");
        expect(scene.scrollY).toBe(10000);
        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-height")).toBe("100px");
        execute();

        expect(div.style.display).toBe("");
        expect(scene.scrollY).toBe(130);
        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-height")).toBe("119px");

        div.remove();
    });
});