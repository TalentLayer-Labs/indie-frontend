import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { Skill } from '../../modules/WorkX/utils/types';

export const MINIMUM_QUERY_LENGTH = 2;

export const useWorkxSkills = (): {
  skills: Skill[];
  query: string;
  fetchData: (name: string) => void;
  setQuery: Dispatch<SetStateAction<string>>;
} => {
  const [query, setQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchData = useCallback(async (query: string) => {
    try {
      if (query.length < MINIMUM_QUERY_LENGTH) return;
      const response = await axios.get('/api/get-skills', { params: { name: query } });
      if (response?.data?.skills?.length > 0) {
        setSkills(response.data.skills);
        return;
      }

      setSkills([]);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData(query);
  }, [fetchData]);

  return { skills: skills, fetchData, query, setQuery };
};
