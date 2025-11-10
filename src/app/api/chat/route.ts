import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req:Request) {

    const body = await req.json();

    const {message} = body;

    if(!message || message.trim()===""){
        NextResponse.json({error:"Message is required"},{status:400})
    }

    const conversation = openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages: [
            {
                role:"system",
                content:"Hi, assistant."
            },
            {
                role: "user",
                content:message
            }
        ]
    })
    
    return NextResponse.json((await conversation).choices[0].message.content);
}