/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShareImageRequest {
  score: number;
  category: 'high' | 'moderate' | 'low';
  label: string;
  fromLocation: string;
  toLocation: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { score, category, label, fromLocation, toLocation }: ShareImageRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Determine color based on category
    const colorDescription = category === 'high' 
      ? 'vibrant green' 
      : category === 'moderate' 
        ? 'warm orange' 
        : 'red';

    const prompt = `Create a modern, clean social media share card image for a walkability score app called "WalkScore City Heart". 
    
The design should include:
- A large prominent score of "${score}" displayed in ${colorDescription} color
- The label "${label}" below the score
- A subtle walking/pedestrian icon
- The route: "From: ${fromLocation}" to "To: ${toLocation}" shown elegantly
- Clean white background with soft gradients
- Modern typography, minimalist style
- The app name "WalkScore City Heart" in the corner
- Professional, shareable look suitable for Twitter/LinkedIn

Aspect ratio should be 16:9 for optimal social media display.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error generating share image:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
