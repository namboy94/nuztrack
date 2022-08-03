export interface ViewModel<State, Interactions> {
    state: State,
    interactions: Interactions
}

export function getState<State, Interactions>(hookResult: { current: ViewModel<State, Interactions> }): State {
    return hookResult.current.state
}

export function getInteractions<State, Interactions>(hookResult: { current: ViewModel<State, Interactions> }): Interactions {
    return hookResult.current.interactions
}