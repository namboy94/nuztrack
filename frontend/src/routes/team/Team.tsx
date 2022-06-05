import {NuzlockeRun} from "../../api/runs/runsTypes";
import {performLoadingCheck} from "../../util/loading";
import {useTeamQuery} from "../../api/team_member/teamMemberQuery";

export interface TeamProps {
    run: NuzlockeRun
}

export default function Team(props: TeamProps) {

    const teamQuery = useTeamQuery(props.run.id)
    const loadCheck = performLoadingCheck([teamQuery])
    if (loadCheck !== null) {
        return loadCheck
    }
    const team = teamQuery.data!!

    return (
        <>
            <h1>Team</h1>
            <h2>Active</h2>
            {team.active.map(x => <p key={x.id}>{x.nickname}</p>)}
            <h2>Boxed</h2>
            {team.boxed.map(x => <p key={x.id}>{x.nickname}</p>)}
            <h2>Dead</h2>
            {team.dead.map(x => <p key={x.id}>{x.nickname}</p>)}
        </>
    )
}