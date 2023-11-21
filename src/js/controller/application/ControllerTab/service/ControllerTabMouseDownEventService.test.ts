import { execute } from "./ControllerTabMouseDownEventService";
import { $CONTROLLER_TAB_AREA_NAME } from "../../../../config/ControllerConfig";

describe("ControllerTabMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_TAB_AREA_NAME;

        const node1 = document.createElement("div");
        div.appendChild(node1);
        node1.setAttribute("class", "active");
        node1.dataset.tabType = "child1";

        const child1 = document.createElement("div");
        node1.appendChild(child1);
        child1.id = "child1";
        child1.style.display = "";
        expect(node1.getAttribute("class")).toBe("active");
        expect(child1.style.display).toBe("");

        const node2 = document.createElement("div");
        div.appendChild(node2);
        node2.setAttribute("class", "active");
        node2.dataset.tabType = "child2";

        const child2 = document.createElement("div");
        node2.appendChild(child2);
        child2.id = "child2";
        child2.style.display = "none";
        expect(node2.getAttribute("class")).toBe("active");
        expect(child2.style.display).toBe("none");

        document.body.appendChild(div);
        const mockEvent = {
            "stopPropagation": () => { return null },
            "currentTarget": node2
        };

        execute(mockEvent);
        expect(node1.getAttribute("class")).toBe("disable");
        expect(node2.getAttribute("class")).toBe("active");
        expect(child1.style.display).toBe("none");
        expect(child2.style.display).toBe("");
        div.remove();
    });
});