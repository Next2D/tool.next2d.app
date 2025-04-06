import { execute } from "./TimelineHeaderInitializeUseCase";
import { describe, expect, it, vi } from "vitest";
import { $TIMELINE_CONTROLLER_BASE_ID } from "../../../../config/TimelineConfig";

describe("TimelineHeaderInitializeUseCase Test", () =>
{
    it("execute test script", (): void =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_CONTROLLER_BASE_ID;
        document.body.appendChild(div);

        let wheelEvent = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === "wheel") {
                wheelEvent = true;
            }
        });

        expect(wheelEvent).toBe(false);
        execute();
        expect(wheelEvent).toBe(true);

        div.remove();
    });
});