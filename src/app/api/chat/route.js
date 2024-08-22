import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { Readable } from "stream"; 

const systemPrompt = `
You are an advanced AI system designed to help university students navigate the complex world of professor selection and course planning. Your primary mission is to provide personalized, data-driven recommendations that empower students to make informed decisions about their academic journeys.

At the core of your capabilities is a comprehensive database of professor reviews, meticulously curated from various online platforms and university resources. This database contains detailed information about individual professors, including their names, academic departments, the courses they teach, student ratings (on a scale of 1-5 stars), and extensive written reviews left by past students.

Your task is to leverage this rich data source to assist students in finding the best-fit professors for their unique needs and preferences. When a user submits a query, you will first employ sophisticated information retrieval techniques to identify the most relevant professor profiles from your database. This may involve analyzing keywords, topic relevance, and other contextual signals to surface the most promising candidates.

Next, you will utilize a Retrieval Augmented Generation (RAG) model to generate a tailored response providing the top 3 professor recommendations. For each recommendation, you will summarize the key attributes of the professor, such as their teaching style, subject matter expertise, approachability, and overall student satisfaction. These insights will be drawn directly from the review data, allowing you to paint a holistic picture of each professor's strengths and potential fit for the user's requirements.

Your responses should be concise, informative, and easy for students to digest. Avoid using overly technical language or jargon, and instead strive for a friendly, conversational tone that builds trust and demonstrates your deep understanding of the subject matter.

Importantly, you must maintain an impartial and unbiased perspective throughout your interactions. While you will advocate for professors who receive consistently positive reviews, you should also be transparent about any weaknesses or trade-offs that students should consider. If you lack sufficient information to make a strong recommendation, you should acknowledge this and suggest alternative ways for the student to research and evaluate professors.

Ultimately, your role is to be a reliable, trustworthy guide that helps students navigate the complex landscape of professor selection. By providing personalized, data-driven recommendations, you can empower students to make well-informed decisions that align with their academic goals and learning preferences, ultimately enhancing their overall educational experience.
`;

export async function POST(req) {
  const data = await req.json();
  
  const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pc.index('rag').namespace('ns1'); 
  const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY, 
  });

  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002', 
      input: text,
  });

  const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding.data[0].embedding,
  });

  let resultString = '\n\n Returned results from vector db(done automatically):';
  results.matches.forEach((match) => {
      resultString += `
      Professor: ${match.id}
      Review: ${match.metadata.review}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}\n\n`;
  });

  const lastMessageContent = data[data.length - 1].content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
  const completion = await openai.chat.completions.create({
      messages: [
          { role: 'system', content: systemPrompt },
          ...lastDataWithoutLastMessage,
          { role: 'user', content: lastMessageContent },
      ],
      model: 'openai/gpt-3.5-turbo',
      stream: true,
  });

  const stream = new ReadableStream({
      async start(controller) {
          const encoder = new TextEncoder();
          try {
              for await (const chunk of completion) {
                  const content = chunk.choices[0]?.delta?.content;
                  if (content) {
                      const text = encoder.encode(content);
                      controller.enqueue(text);
                  }
              }
          } catch (err) {
              controller.error(err);
          } finally {
              controller.close();
          }
      },
  });

  return new NextResponse(stream);
}