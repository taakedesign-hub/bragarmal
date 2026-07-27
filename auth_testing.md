# Auth Testing Playbook — Skrivestemme

The app uses Emergent-managed Google Auth. Since automated tests cannot complete a real Google OAuth flow, use the seeded session token approach below.

## Step 1: Seed a test user and session in MongoDB
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.writer.' + Date.now() + '@example.com',
  name: 'Testforfatter',
  picture: null,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('SESSION_TOKEN=' + sessionToken);
print('USER_ID=' + userId);
"
```

## Step 2: Test backend APIs
Base URL: use REACT_APP_BACKEND_URL from /app/frontend/.env

Auth check:
```
curl -X GET "$BASE/api/auth/me" -H "Authorization: Bearer $SESSION_TOKEN"
```

Add sample (paste):
```
curl -X POST "$BASE/api/samples" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Han husker lukter best. Lukten av fuktig betong og sigarettrøyk. Lukten av blod da han var tolv og måtte se på mens de lærte en mann som skyldte penger. Lukten av frykt i sin egen munn hver gang han løp hjem til fjerde etasje."}'
```

Upload sample:
```
curl -X POST "$BASE/api/samples/upload" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -F "file=@/tmp/sample.txt" -F "title=Prøve fra fil"
```

Analyze voice:
```
curl -X POST "$BASE/api/voice/analyze" -H "Authorization: Bearer $SESSION_TOKEN"
```

Generate (streaming, POST body):
```
curl -N -X POST "$BASE/api/generate" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"prompt","text":"En novemberkveld ringte telefonen tre ganger.","model":"claude-sonnet-4-5","humanize_level":2,"length":"kort"}'
```

Detect:
```
curl -X POST "$BASE/api/detect" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I en verden der alt går fort, er det viktig å merke seg at ting endrer seg."}'
```

## Step 3: Browser testing
```
await page.context.add_cookies([{
  "name": "session_token",
  "value": "SESSION_TOKEN_HERE",
  "domain": "echo-writer-2.preview.emergentagent.com",
  "path": "/",
  "httpOnly": True,
  "secure": True,
  "sameSite": "None"
}])
await page.goto("https://echo-writer-2.preview.emergentagent.com/dashboard")
```

## Cleanup
```
mongosh --eval "
use('test_database');
db.users.deleteMany({email: /test\.writer\./});
db.user_sessions.deleteMany({session_token: /test_session/});
db.samples.deleteMany({user_id: /test-user-/});
db.voice_profiles.deleteMany({user_id: /test-user-/});
"
```

## Success indicators
- `/api/auth/me` returns user JSON (not 401)
- Dashboard, Prøver, Stemme, Skriv pages render (not redirect to /)
- Sample creation returns 200 with id/word_count
- `/api/voice/analyze` returns profile with top_words, sentence_length_distribution
- `/api/generate` streams tokens as SSE `data: {"delta": "..."}` lines, then `data: {"done": true}`
- `/api/detect` returns score, label, ai_markers
