import { Combobox } from '@headlessui/react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { MINIMUM_QUERY_LENGTH, useWorkxSkills } from '../../hooks/workx/useWorkxSkills';
import { debounce } from 'lodash';

export function SkillsInput({ initialValues }: { initialValues?: string }) {
  const formikProps = useFormikContext();
  const { skills: filteredSkills, fetchData: refreshSkills, query, setQuery } = useWorkxSkills();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [allSkills, setAllSkills] = useState(initialValues?.split(',') || []);

  const selectSkill = (value: string) => {
    const newSkills = [...allSkills, value];
    setAllSkills(newSkills);
    setSelectedSkill('');
    setQuery('');
    formikProps.setFieldValue('skills', newSkills.toString());
  };

  useEffect(() => {
    refreshSkills(query);
  }, [query, refreshSkills]);

  useEffect(() => {
    if (initialValues) {
      setAllSkills(initialValues.split(','));
    }
  }, [initialValues]);

  const renderSkills = allSkills.map((skill: string) => {
    return (
      <div
        key={skill}
        className={
          'leading-tight mr-2 inline-flex items-center rounded-full bg-indigo-100 pl-3 text-sm font-medium text-blue-800'
        }>
        <span>{skill}</span>
        <span
          className={'ml-1 cursor-pointer rounded-full bg-indigo-300 p-1 w-[28px] text-center'}
          onClick={() => {
            const newSkills = [...allSkills];
            newSkills.splice(newSkills.indexOf(skill), 1);
            setAllSkills(newSkills);
          }}>
          {' '}
          x
        </span>
      </div>
    );
  });

  const updateQuery = (value: string) => {
    setQuery(value);
  };

  const debounceSetQuery = debounce(updateQuery, 500);

  return (
    <>
      <Combobox value={selectedSkill} onChange={value => selectSkill(value)}>
        <div className='relative'>
          <div className='relative mb-2'>
            <Combobox.Input
              className='mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              onChange={event => debounceSetQuery(event.target.value)}
            />
          </div>
          {query.length >= 2 && (
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredSkills?.length === 0 && query.length >= MINIMUM_QUERY_LENGTH ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredSkills
                  ?.filter(skill => !allSkills.includes(skill.name))
                  .map(
                    skill =>
                      query.length >= MINIMUM_QUERY_LENGTH && (
                        <Combobox.Option
                          key={skill.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                            }`
                          }
                          value={skill.name}>
                          <span className='block truncate font-normal'>{skill.name}</span>
                        </Combobox.Option>
                      ),
                  )
              )}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      {renderSkills}
    </>
  );
}
