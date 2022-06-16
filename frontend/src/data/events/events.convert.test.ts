import {eventsConverter} from "./events.convert";
import {
    CREATE_DEATH_EVENT,
    CREATE_DEATH_EVENT_TO,
    CREATE_ENCOUNTER_EVENT,
    CREATE_ENCOUNTER_EVENT_TO,
    CREATE_EVOLUTION_EVENT,
    CREATE_EVOLUTION_EVENT_TO,
    CREATE_MILESTONE_EVENT,
    CREATE_MILESTONE_EVENT_TO,
    CREATE_NOTE_EVENT,
    CREATE_NOTE_EVENT_TO,
    CREATE_TEAM_MEMBER_SWITCH_EVENT,
    CREATE_TEAM_MEMBER_SWITCH_EVENT_TO,
    DEATH_EVENT,
    DEATH_EVENT_TO,
    ENCOUNTER_EVENT_SUCCESSFUL,
    ENCOUNTER_EVENT_SUCCESSFUL_TO,
    EVENT_LIST,
    EVENT_LOG_TO,
    EVOLUTION_EVENT,
    EVOLUTION_EVENT_TO,
    MILESTONE_EVENT,
    MILESTONE_EVENT_TO,
    NOTE_EVENT,
    NOTE_EVENT_TO,
    TEAM_MEMBER_SWITCH_EVENT,
    TEAM_MEMBER_SWITCH_EVENT_TO
} from "./events.testconstants";

describe("EventsConverter", () => {

    it("should convert an EventLogTO to list of Events", (done) => {
        const converted = eventsConverter.convertEventLogTOEventList(EVENT_LOG_TO)
        expect(converted).toEqual(EVENT_LIST)
        done()
    })

    it("should convert an EncounterEvent TO to Model", (done) => {
        const converted = eventsConverter.convertEncounterEventTOToModel(ENCOUNTER_EVENT_SUCCESSFUL_TO)
        expect(converted).toEqual(ENCOUNTER_EVENT_SUCCESSFUL)
        done()
    })
    it("should convert a DeathEvent TO to Model", (done) => {
        const converted = eventsConverter.convertDeathEventTOToModel(DEATH_EVENT_TO)
        expect(converted).toEqual(DEATH_EVENT)
        done()
    })
    it("should convert an EvolutionEvent TO to Model", (done) => {
        const converted = eventsConverter.convertEvolutionEventTOToModel(EVOLUTION_EVENT_TO)
        expect(converted).toEqual(EVOLUTION_EVENT)
        done()
    })
    it("should convert a MilestoneEvent TO to Model", (done) => {
        const converted = eventsConverter.convertMilestoneEventTOToModel(MILESTONE_EVENT_TO)
        expect(converted).toEqual(MILESTONE_EVENT)
        done()
    })
    it("should convert a NoteEvent TO to Model", (done) => {
        const converted = eventsConverter.convertNoteEventTOToModel(NOTE_EVENT_TO)
        expect(converted).toEqual(NOTE_EVENT)
        done()
    })
    it("should convert an TeamMemberSwitchEvent TO to Model", (done) => {
        const converted = eventsConverter.convertTeamMemberSwitchEventTOToModel(TEAM_MEMBER_SWITCH_EVENT_TO)
        expect(converted).toEqual(TEAM_MEMBER_SWITCH_EVENT)
        done()
    })
    it("should convert a CreateEncounterEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateEncounterEventModelToTO(CREATE_ENCOUNTER_EVENT)
        expect(converted).toEqual(CREATE_ENCOUNTER_EVENT_TO)
        done()
    })
    it("should convert a CreateDeathEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateDeathEventModelToTO(CREATE_DEATH_EVENT)
        expect(converted).toEqual(CREATE_DEATH_EVENT_TO)
        done()
    })
    it("should convert a CreateEvolutionEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateEvolutionEventModelToTO(CREATE_EVOLUTION_EVENT)
        expect(converted).toEqual(CREATE_EVOLUTION_EVENT_TO)
        done()
    })
    it("should convert a CreateMilestoneEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateMilestoneEventModelToTO(CREATE_MILESTONE_EVENT)
        expect(converted).toEqual(CREATE_MILESTONE_EVENT_TO)
        done()
    })
    it("should convert a CreateNoteEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateNoteEventModelToTO(CREATE_NOTE_EVENT)
        expect(converted).toEqual(CREATE_NOTE_EVENT_TO)
        done()
    })
    it("should convert a CreateTeamMemberSwitchEvent Model to TO", (done) => {
        const converted = eventsConverter.convertCreateTeamMemberSwitchEventModelToTO(CREATE_TEAM_MEMBER_SWITCH_EVENT)
        expect(converted).toEqual(CREATE_TEAM_MEMBER_SWITCH_EVENT_TO)
        done()
    })

})