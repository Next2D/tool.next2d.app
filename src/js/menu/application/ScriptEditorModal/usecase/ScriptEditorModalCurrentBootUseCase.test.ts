import { execute } from "./ScriptEditorModalCurrentBootUseCase";
import { describe, expect, it, vi } from "vitest";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { $SCRIPT_EDITOR_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { ScriptEditorModal } from "../../../../menu/domain/model/ScriptEditorModal";

describe("ScriptEditorModalCurrentBootUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        $registerMenu(new ScriptEditorModal());

        $updateKeyLock(false);
        expect($useKeyboard()).toBe(false);
        execute();
        expect($useKeyboard()).toBe(true);
    });
});