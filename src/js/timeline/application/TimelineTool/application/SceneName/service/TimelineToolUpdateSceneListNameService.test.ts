import { execute } from "./TimelineToolUpdateSceneListNameService";

describe("TimelineToolUpdateSceneListNameServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = "scene-instance-id-0";
        document.body.appendChild(div);

        expect(div.textContent).toBe("");
        await execute(1, "test");
        expect(div.textContent).toBe("");
        await execute(0, "test");
        expect(div.textContent).toBe("test");

        div.remove();
    });
});