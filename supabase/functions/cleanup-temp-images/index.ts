// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    const { data: thumbFiles, error: thumbErr } = await supabase.storage
      .from("quiz-uploads")
      .list("temp/thumbnail", {
        limit: 1000,
        sortBy: { column: "created_at", order: "asc" },
      });
    const { data: qFiles, error: qErr } = await supabase.storage
      .from("quiz-uploads")
      .list("temp/question", {
        limit: 1000,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (thumbErr) throw thumbErr;
    if (qErr) throw qErr;

    const now = new Date();
    const cutoffHours = 12; // NOTE: modify this to change the cutoff hours
    let removedCount = 0;

    // Helper to check if older than 24h
    function isOlderThanCutoff(lastModified: string | undefined): boolean {
      // last_modified is a date string like "2023-09-01T12:34:56Z"
      if (!lastModified) return false; // fallback
      const fileTime = new Date(lastModified).getTime();
      const diffHours = (now.getTime() - fileTime) / (1000 * 60 * 60);
      return diffHours > cutoffHours;
    }

    // 2) For each file, if older than 24 hours, remove
    async function removeOldFiles(
      pathPrefix: string,
      files: { name: string; updated_at?: string }[],
    ) {
      const toRemove: string[] = [];
      for (const f of files) {
        if (isOlderThanCutoff(f.updated_at)) {
          toRemove.push(`${pathPrefix}/${f.name}`);
        }
      }
      if (toRemove.length > 0) {
        const { error: rmErr } = await supabase.storage
          .from("quiz-uploads")
          .remove(toRemove);
        if (rmErr) {
          console.log("Error removing files:", rmErr);
        } else {
          removedCount += toRemove.length;
        }
      }
    }

    if (thumbFiles) {
      await removeOldFiles("temp/thumbnail", thumbFiles);
    }
    if (qFiles) {
      await removeOldFiles("temp/question", qFiles);
    }

    return new Response(JSON.stringify({ removedCount }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cleanup-temp-images' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
