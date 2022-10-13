import {act, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function selectAutocompleteIndex(autocompleteId: string, index: number) {
    const autoComplete = screen.getByTestId(autocompleteId)
    const combobox = within(autoComplete).getByRole("combobox")

    act(() => {
        combobox.focus()
        userEvent.keyboard("{ArrowDown}")
    })
    act(() => {
        for (let i = 0; i <= index; i++) {
            userEvent.keyboard("{ArrowDown}")
        }
        userEvent.keyboard("{Enter}")
    })
}

export function selectAutocompleteText(autocompleteId: string, text: string) {
    const autoComplete = screen.getByTestId(autocompleteId)
    const combobox = within(autoComplete).getByRole("combobox")

    act(() => {
        combobox.focus()
        userEvent.type(combobox, text)
        userEvent.keyboard("{ArrowDown}{Enter}")
    })
}
