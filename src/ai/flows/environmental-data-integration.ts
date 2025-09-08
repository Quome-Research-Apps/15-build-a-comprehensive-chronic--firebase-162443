'use server';

/**
 * @fileOverview This flow integrates with external APIs to fetch environmental data based on user location.
 *
 * - getEnvironmentalData - A function that fetches weather and air quality data based on a location.
 * - EnvironmentalDataInput - The input type for the getEnvironmentalData function.
 * - EnvironmentalDataOutput - The return type for the getEnvironmentalData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalDataInputSchema = z.object({
  location: z.string().describe('The city or location to fetch environmental data for.'),
});
export type EnvironmentalDataInput = z.infer<typeof EnvironmentalDataInputSchema>;

const EnvironmentalDataOutputSchema = z.object({
  weather: z.string().describe('The current weather conditions.'),
  airQuality: z.string().describe('The current air quality index and description.'),
});
export type EnvironmentalDataOutput = z.infer<typeof EnvironmentalDataOutputSchema>;

export async function getEnvironmentalData(input: EnvironmentalDataInput): Promise<EnvironmentalDataOutput> {
  return environmentalDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'environmentalDataPrompt',
  input: {schema: EnvironmentalDataInputSchema},
  output: {schema: EnvironmentalDataOutputSchema},
  prompt: `You are an AI assistant that fetches environmental data for a given location.

  Based on the location provided, fetch the current weather conditions and air quality index.

  Location: {{{location}}}

  Return the weather and air quality in a JSON format.
  `,
});

const environmentalDataFlow = ai.defineFlow(
  {
    name: 'environmentalDataFlow',
    inputSchema: EnvironmentalDataInputSchema,
    outputSchema: EnvironmentalDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
