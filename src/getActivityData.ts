import { Sprint, SprintId, CommitId, Commit, EntityGroups } from './types';
import { ActivityData, HeatMap } from './stories';

export default function getActivityData({
  entities,
  groupedCommits,
  selectedSprintId,
  timeOffset,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Set<CommitId>>;
  selectedSprintId: number;
  timeOffset: number;
}): ActivityData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  const currentCommits = groupedCommits.get(selectedSprintId) as Set<CommitId>;

  // const arrayHeatMap = Array(7).fill(Array(24).fill(0));
  const arrayHeatMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  currentCommits.forEach((commitId) => {
    const commit = entities.commits.get(commitId) as Commit;
    const date = new Date(commit.timestamp + timeOffset);
    const hours = date.getHours();
    let day = date.getDay();

    if (day === 0) day = 6;
    else day -= 1;

    arrayHeatMap[day][hours] += 1;
  });

  const heatMap: HeatMap = {
    mon: arrayHeatMap[0],
    tue: arrayHeatMap[1],
    wed: arrayHeatMap[2],
    thu: arrayHeatMap[3],
    fri: arrayHeatMap[4],
    sat: arrayHeatMap[5],
    sun: arrayHeatMap[6],
  };

  return {
    title: 'Коммиты',
    subtitle: currentSprint.name,
    data: heatMap,
  };
}
