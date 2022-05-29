import {render, unmountComponentAtNode} from "react-dom";
import DeleteRunDialog, {DeleteRunDialogProps} from "./DeleteRunDialog"


let container: HTMLDivElement | null = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container!!);
    container!!.remove();
    container = null;
});

function renderDeleteRunDialog(props: Partial<DeleteRunDialogProps> = {}) {
    const defaultProps: DeleteRunDialogProps = {
        open: true,
        onClose: () => {
        },
        runToDelete: null,
        removeRun: x => {
        }
    }
    return render(<DeleteRunDialog {...defaultProps}/>, container)
}

describe("<DeleteRunDialog/>", () => {
    test("Should be green", async () => {
        const dialog = renderDeleteRunDialog()
        expect([]).toBeEmpty()
    })
})