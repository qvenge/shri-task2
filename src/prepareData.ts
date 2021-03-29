import { RawEntity } from './raw-types';
import { StoryData } from './stories';
import processEntities from './processEntities';
import { groupCommitsBySprints } from './util';
import getLeadersData from './getLeadersData';
import getVoteData from './getVoteData';
import getChartData from './getChartData';
import getDiagramData from './getDiagramData';
import getActivityData from './getActivityData';

// const timeOffset = -4 * 60 * 60 * 1000; // для тестов
const timeOffset = 0;

function prepareData(entityArray: RawEntity[], { sprintId: selectedSprintId }: { sprintId: number }): StoryData {
  // группирую сущности по типу и привожу их более удобному виду
  // теперь сущности ссылаются на другие сущности только по id
  const entities = processEntities(entityArray);
  // группирую коммиты по спринтам. На выходе Map<SprintId, Set<CommitId>>
  const groupedCommits = groupCommitsBySprints(entities);
  const leadersData = getLeadersData({ entities, groupedCommits, selectedSprintId });
  const voteData = getVoteData({ entities, selectedSprintId });
  // в чарт передаю готовый список лидеров
  const chartData = getChartData({ entities, groupedCommits, selectedSprintId, outputUsers: leadersData.users });
  const diagramData = getDiagramData({ entities, groupedCommits, selectedSprintId });
  const activityData = getActivityData({ entities, groupedCommits, selectedSprintId, timeOffset });

  return [
    {
      alias: 'leaders',
      data: leadersData,
    },
    {
      alias: 'vote',
      data: voteData,
    },
    {
      alias: 'chart',
      data: chartData,
    },
    {
      alias: 'diagram',
      data: diagramData,
    },
    {
      alias: 'activity',
      data: activityData,
    },
  ];
}

module.exports = prepareData;
