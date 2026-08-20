import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("renders the office-game flow rather than the starter skeleton", async () => {
  const [page, layout] = await Promise.all([
    read("app/page.tsx"),
    read("app/layout.tsx"),
  ]);

  assert.match(page, /const questions = \[/);
  assert.match(page, /questionCount=11|questions\.length/);
  assert.match(page, /QRCode\.toDataURL/);
  assert.match(page, /\/api\/answers/);
  assert.match(page, /mode===\"quiz\"/);
  assert.match(page, /function Stats/);
  assert.match(layout, /lang=\"kk\"/);
  assert.match(layout, /adamdar/);
  assert.match(layout, /Noto_Sans/);
  assert.match(layout, /subsets: \[\"cyrillic\", \"latin\"\]/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton/);
});

test("keeps quiz response validation aligned with the 11-question UI", async () => {
  const route = await read("app/api/answers/route.ts");

  assert.match(route, /const questionCount=11/);
  assert.match(route, /answers\.length!==questionCount/);
  assert.match(route, /answers\.some\(v=>v!==0&&v!==1\)/);
  assert.match(route, /participants_v5/);
  assert.match(route, /cache-control":"no-store/);
});
