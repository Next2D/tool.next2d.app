import { execute } from "./TimelineLayerGetHighlightColorService";

describe("TimelineLayerGetHighlightColorServiceTest", () =>
{
    test("execute test", async () =>
    {
        const colors: string[] = [
            "#ff0000",
            "#0000ff",
            "#32cd32",
            "#ffc0cb",
            "#ffd700",
            "#ff8c00",
            "#00ffff",
            "#ff00ff",
            "#008080",
            "#00bfff",
            "#ff6347",
            "#fa8072",
            "#ff69b4",
            "#7fff00",
            "#ffffe0",
            "#9370db"
        ];

        for (let idx = 0; idx < colors.length; ++idx) {
            expect(colors.indexOf(execute())).toBeGreaterThan(-1);
        }
    });
});