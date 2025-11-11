import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Chunk {
  text: string;
  index: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { chunks, filename, documentId } = await req.json();

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid chunks data" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const processedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embeddingResponse = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-ada-002",
            input: chunk,
          }),
        }
      );

      if (!embeddingResponse.ok) {
        const error = await embeddingResponse.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      const insertResponse = await fetch(
        `${supabaseUrl}/rest/v1/knowledge_base`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            title: `${filename} - Chunk ${i + 1}`,
            content: chunk,
            content_type: "description",
            category: "uploaded_document",
            language: "it",
            source_document: filename,
            chunk_index: i,
            word_count: chunk.split(/\s+/).length,
            embedding: embedding,
          }),
        }
      );

      if (!insertResponse.ok) {
        const error = await insertResponse.text();
        throw new Error(`Database insert error: ${error}`);
      }

      processedChunks.push({ index: i, success: true });
    }

    return new Response(
      JSON.stringify({
        success: true,
        chunksProcessed: processedChunks.length,
        message: `Successfully processed ${processedChunks.length} chunks`,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing document:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process document",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});