// ============================================================
//  어텐션 코치 · Supabase Edge Function (이름: coach)
//  Supabase 대시보드 → Edge Functions → "Deploy a new function"
//   → "Via Editor" 선택 → 함수 이름을 coach 로 → 아래 코드 전체 붙여넣기 → Deploy
//
//  ※ 배포 후 두 가지 설정 필요 (가이드 참고):
//    1) Secret 추가:  ANTHROPIC_API_KEY = sk-ant-... (본인 키)
//    2) 이 함수의 "Verify JWT" 설정을 OFF (학생이 로그인 없이 호출하도록)
// ============================================================

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const { system, messages } = await req.json();
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ error: "ANTHROPIC_API_KEY 미설정" }, 500);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // 빠르고 저렴한 모델 (코칭용)
        max_tokens: 600,
        system,
        messages,
      }),
    });

    const d = await r.json();
    if (!r.ok) return json({ error: d?.error?.message || "anthropic error" }, 500);

    const text = (d.content || [])
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("\n")
      .trim();

    return json({ text });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
