# 어텐션 D-day 플래너

중·고등학생을 위한 시험 준비 주간 플래너. AI가 과목별 분량을 7일에 자동 배분하고, 회고 코치가 한 주를 돌아보게 도와줍니다.

## 파일 구조

```
files/
  index.html          학생용 플래너 (메인)
  teacher.html        원장님 대시보드
  1_supabase_schema.sql   Supabase 테이블 생성 스크립트
  2_coach_edge_function.ts  AI 코치 Edge Function
```

## 배포 전 설정

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. **SQL Editor**에서 `1_supabase_schema.sql` 전체 실행 → `students` 테이블 생성
3. **Settings > API** 에서 `URL`과 `anon public` 키 복사

### 2. Edge Function 배포
1. Supabase 대시보드 > **Edge Functions** > "Deploy a new function"
2. 함수 이름: `coach`, 코드: `2_coach_edge_function.ts` 붙여넣기 후 Deploy
3. **Secrets** 탭에서 `ANTHROPIC_API_KEY = sk-ant-...` 추가
4. 함수의 **Verify JWT** 설정을 **OFF**로 변경

### 3. index.html 설정
`files/index.html` 상단 CONFIG 블록을 채우세요:

```js
const CONFIG = {
  SUPABASE_URL : "https://YOUR_PROJECT.supabase.co",
  SUPABASE_KEY : "your-anon-public-key",   // anon public key (공개 안전)
  FUNCTION_URL : "https://YOUR_PROJECT.supabase.co/functions/v1/coach",
};
```

> `SUPABASE_KEY`는 Supabase **anon public** 키로, 공개 저장소에 올려도 안전합니다.  
> Row Level Security(RLS)가 `1_supabase_schema.sql`에 이미 설정되어 있습니다.

### 4. teacher.html 설정
`files/teacher.html` 상단 CONFIG에서 **비밀번호를 반드시 변경**하세요:

```js
const CONFIG = {
  SUPABASE_URL    : "https://YOUR_PROJECT.supabase.co",
  SUPABASE_KEY    : "your-anon-public-key",
  TEACHER_PASSCODE: "원하는-비밀번호",   // ← 반드시 변경!
};
```

> ⚠️ 기본 비밀번호가 코드에 그대로 남아 있으면 누구나 대시보드에 접근할 수 있습니다.

## 학생 데이터 복구

학생이 기기를 바꾸거나 브라우저 캐시를 지웠을 때:
1. **설정** 탭 > **내 복구 코드** 확인 (처음 기기에서)
2. 새 기기 접속 > 온보딩 화면 > **복구 코드로 데이터 가져오기** 클릭
3. 코드 입력 → 데이터 복원

## 배포

정적 파일이므로 GitHub Pages, Netlify, Vercel 어디서든 배포 가능합니다.

```bash
# GitHub Pages 예시 (files/ 폴더를 루트로 서빙)
# 저장소 Settings > Pages > Source: /files 폴더
```
