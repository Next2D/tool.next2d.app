import {
    $registerMenu,
    $getMenu,
    $getMenuAll
} from "./Menu";

describe("MenuTest", () =>
{
    test("$registerMenu and $getMenu and $getMenuAll test", () =>
    {
        const mock1 = {
            "name": "mock1"
        };

        const mock2 = {
            "name": "mock2"
        };

        $registerMenu(mock1);
        $registerMenu(mock2);
        expect($getMenu("mock1")).toBe(mock1);
        expect($getMenu("mock2")).toBe(mock2);

        const menus = $getMenuAll();
        expect(menus.size).toBe(2);
    });
});