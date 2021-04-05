import { Sprint, SprintId, Commit, EntityGroups } from './types';
import { DiagramData } from './stories';
import { getOutput, groupCommitsBySize } from './util';

export default function getDiagramData({
  entities,
  groupedCommits,
  selectedSprintId,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Commit[]>;
  selectedSprintId: number;
}): DiagramData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  // сортирую спринты по дате на всякий случай
  const sortedSprints = Array.from(entities.sprints.values())
    .sort(({ startAt: start1 }, { startAt: start2 }) => start1 - start2)
    .map((sprint) => sprint.id);
  const currentSprintIndex = sortedSprints.indexOf(selectedSprintId);
  const previousSprintId = sortedSprints[currentSprintIndex - 1];

  // все коммиты за текущий спринт
  const currentCommits = groupedCommits.get(selectedSprintId) ?? [];
  const sizeGroupedCurrentCommits = groupCommitsBySize(entities, currentCommits);
  const currentCommitsTotal = sizeGroupedCurrentCommits.map((commits) => commits.length);

  // все коммиты за предыдущий спринт
  const previousCommits = groupedCommits.get(previousSprintId) ?? [];
  const sizeGroupedPreviousCommits = groupCommitsBySize(entities, previousCommits);
  const previousCommitsTotal = sizeGroupedPreviousCommits.map((commits) => commits.length);

  const differences: number[] = [];

  for (let i = 0; i < 4; ++i) {
    const diff = currentCommitsTotal[i] - previousCommitsTotal[i];
    differences.push(diff);
  }

  const totalDifference = currentCommits.length - previousCommits.length;
  const categories = ['> 1001 строки', '501 — 1000 строк', '101 — 500 строк', '1 — 100 строк'].map((title, index) => ({
    title,
    valueText: getOutput(sizeGroupedCurrentCommits[index].length, ['коммит', 'коммита', 'коммитов']),
    differenceText: getOutput(differences[index], ['коммит', 'коммита', 'коммитов']),
  }));

  return {
    title: 'Размер коммитов',
    subtitle: currentSprint.name,
    totalText: getOutput(currentCommits.length, ['коммит', 'коммита', 'коммитов']),
    differenceText: `${totalDifference} с прошлого спринта`,
    categories,
  };
}
