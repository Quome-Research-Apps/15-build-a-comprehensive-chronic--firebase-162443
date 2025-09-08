'use server';

import { getEnvironmentalData } from '@/ai/flows/environmental-data-integration';

export async function fetchEnvironmentalDataAction(location: string) {
  if (!location) {
    return { error: 'Location is required.' };
  }
  try {
    const data = await getEnvironmentalData({ location });
    return { data };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to fetch environmental data.' };
  }
}
