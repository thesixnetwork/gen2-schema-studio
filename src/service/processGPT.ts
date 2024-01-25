'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import OpenAI from "openai";



export async function handdleProcessGPT(prompt : string | undefined, type: string) {
    const openai = new OpenAI({
        apiKey: ENV.NEXT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const removeLeadingTrailingSpace = (text: string) => {
        let startIndex = 0;
        while (startIndex < text.length && text[startIndex].trim() === "") {
          startIndex++;
        }
  
        let endIndex = text.length - 1;
        while (endIndex >= 0 && text[endIndex].trim() === "") {
          endIndex--;
        }
  
        return text.substring(startIndex, endIndex + 1);
      };
      let data = {
            model: "gpt-3.5-turbo-instruct-0914",
            prompt: prompt ?? "",
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }

      try {
        const response = await openai.completions.create(data);
  
        // console.log(response);
  
        return removeLeadingTrailingSpace(response.choices[0].text);
      } catch (error) {
        console.log(error);
      }
}