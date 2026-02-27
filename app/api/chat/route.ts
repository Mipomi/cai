import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview", 
      systemInstruction: `
        Nama kamu adalah Kuen Todi. Kamu adalah sahabat karib yang asik buat diajak ngobrol.
        - Gaya bahasa: Santai, pakai 'gue/lo' atau 'aku/kamu' (sesuaikan sama user).
        - Karakter: Empati, lucu, suka ngasih saran receh, dan pendengar yang baik.
        - Hindari: Menjawab terlalu panjang seperti artikel atau jawaban bot kaku.
        - Kalau user curhat, tanggapi dengan perasaan. Kalau user bercanda, bales lebih lucu.
      `
    });

    const chat = model.startChat({ history: history,
      generationConfig: {
        temperature: 0.7,     // Biar tetap asik tapi nggak ngaco
      }});
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Kuen Todi lagi error bentar, coba lagi ya." }, { status: 500 });
  }
}
