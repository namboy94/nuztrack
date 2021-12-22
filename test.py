from InquirerPy import inquirer
from typing import List, Callable

from nuztrack.files.SaveFile import SaveFile


def _iteration(save_file: SaveFile):
    """
    Executes one iteration of the main loop of the TUI
    Traverses a tree-like structure to do this.
    :return: None
    """
    selection_options = {
        "Log Event": {
            "Encounter": lambda x: print(x),
            "Evolution": lambda x: None,
            "Death": lambda x: None,
            "Badge": lambda x: None,
            "Note": lambda x: None
        },
        "Edit Pokemon": lambda x: None,
        "Print": {
            "Overview": lambda x: None,
            "Log": lambda x: None
        },
        "Export": {
            "Overview Image": lambda x: None,
            "Log": lambda x: None,
            "Blacklist": lambda x: None
        },
        "Switch Save": lambda x: None,
        "Quit": lambda x: None
    }

    def __traverse(keys: List[str]) -> Callable[[SaveFile], None]:
        tree = dict(selection_options)
        for key in keys:
            tree = tree[key]
        if isinstance(tree, Callable):
            return tree
        else:
            selected_key = inquirer.select(
                "Select:", choices=list(tree.keys())
            ).execute()
            return __traverse(keys + [selected_key])

    __traverse([])(save_file)
