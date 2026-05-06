import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) analyzer. 
      Compare the following Resume against the Job Description.
      
      RESUME:
      ${resumeText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Return a JSON object exactly in this format:
      {
        "matchScore": number (0-100),
        "matchedKeywords": string[],
        "missingKeywords": string[],
        "strengths": string[],
        "weaknesses": string[],
        "resumeEdits": string[],
        "optimizationTips": string[],
        "jdSummary": string (brief overview of the role)
      }
      
      Be critical and accurate. Focus on hard skills, certifications, and experience requirements.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response if it contains markdown code blocks
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(jsonStr);

      return NextResponse.json(data);
    } catch (apiErr) {
      console.error("[job-match] Gemini error:", apiErr);
      
      // Fallback if quota exceeded or other API error
      return NextResponse.json({
        matchScore: 65 + Math.floor(Math.random() * 20),
        matchedKeywords: ["React", "TypeScript", "Node.js", "REST APIs"],
        missingKeywords: ["GraphQL", "AWS Lambda", "CI/CD", "Docker"],
        strengths: [
          "Strong background in modern frontend frameworks",
          "Proficient in TypeScript and type-safe development",
          "Experience with scalable backend services"
        ],
        weaknesses: [
          "Lacks specific experience with serverless architectures",
          "Missing DevOps and containerization keywords",
          "Limited exposure to cloud-native monitoring tools"
        ],
        resumeEdits: [
          "Explicitly mention your experience with CI/CD tools in the experience section",
          "Add 'Docker' and 'Kubernetes' to your skills list if you have exposure",
          "Quantify your backend performance improvements (e.g., 'reduced API latency by 30%')"
        ],
        optimizationTips: [
          "Use a standard font like Arial or Calibri to ensure ATS readability",
          "Avoid using images or complex tables in your resume",
          "Use standard section headings like 'Work Experience' and 'Education'"
        ],
        jdSummary: "A Senior Full Stack Developer role focusing on building high-performance web applications using React and Node.js with a strong emphasis on cloud infrastructure.",
        isMock: true
      });
    }
  } catch (err) {
    console.error("[job-match] Request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
