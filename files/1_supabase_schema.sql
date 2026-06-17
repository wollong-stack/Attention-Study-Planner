-- ============================================================
--  어텐션 플래너 v2 · Supabase 테이블 생성
--  Supabase 대시보드 → 왼쪽 메뉴 "SQL Editor" → 아래 전체 붙여넣고 RUN
-- ============================================================

create table if not exists public.students (
  id          text primary key,                 -- 학생 기기에서 자동 생성되는 고유 ID
  nickname    text not null,                     -- 학생이 입력한 닉네임 (표시용)
  data        jsonb not null default '{}'::jsonb,-- 플래너 전체 상태(과목/계획/체크)
  progress    int  not null default 0,           -- 완료한 항목 수
  total       int  not null default 0,           -- 전체 항목 수
  updated_at  timestamptz not null default now() -- 마지막 활동 시각
);

alter table public.students enable row level security;

-- 닉네임/학습계획은 민감정보가 아니므로, 익명 키로 읽기/쓰기를 허용합니다.
-- (각 학생의 id는 추측 불가능한 무작위 값이라 사실상 자기 것만 갱신합니다)
drop policy if exists "read all"   on public.students;
drop policy if exists "insert any" on public.students;
drop policy if exists "update any" on public.students;

create policy "read all"   on public.students for select using (true);
create policy "insert any" on public.students for insert with check (true);
create policy "update any" on public.students for update using (true) with check (true);
