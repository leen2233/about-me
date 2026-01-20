import personalData from '../../data.json';

export type PersonalData = typeof personalData;

export const data = personalData;

export const { personal, workExperience, skills, projects, seo, project } = data;
