import { processWorkXRequest } from '../utils/graphql';

export const getWorkXSkills = (name: string): Promise<any> => {
  const query = `
{
  indicatorFind(
    query:{
      name: "${name}"
      indicatorCategory: SKILL
      paging: {
        start: 0,
        limit: 10
      }
    }
  ) {
    name
  }
}
  `;
  return processWorkXRequest(query);
};
