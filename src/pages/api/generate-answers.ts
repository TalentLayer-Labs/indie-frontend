import type { NextApiRequest, NextApiResponse } from "next";
import {Configuration, OpenAIApi} from 'openai';


type ResponceData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const configuration = new Configuration({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration)

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponceData>
  ){
    const prompt = req.query.prompt || req.body.prompt || 'test';

    if (!prompt || prompt === ''){
        //return new Response('Please send your prompt',{ status: 400 })
    }
    console.log({key: process.env.NEXT_PRIVATE_OPENAI_API_KEY, prompt})

    const aiResult = await openai.createCompletion({
      
        "model": "text-davinci-003",
        "prompt": prompt,
        "temperature": 0.9,
        "max_tokens": 2048,
        'frequency_penalty': 0.5,
        'presence_penalty': 0

      
    })

    const result = aiResult.data.choices[0].text?.trim() || 'sorry';

    console.log({result})
  
  
res.status(200).json({text: result})

}
    