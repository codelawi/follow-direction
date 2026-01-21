import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const createUser = async () => {
  serve(async (req: any) => {
    const { email, password, meta } = await req.json();

    const supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: meta ?? {},
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      role: "user",
      access: "limit",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  });
};
