import{b as i,c as o,T as w,U as y,V as s}from"./index-9d92e3d2-r2.js";const E=[20,1440,1440*2,1440*4,1440*7,1440*15,1440*30],p=1200,S=1500;function u(e){const t=Math.min(e,E.length)-1,n=E[Math.max(0,t)];return new Date(Date.now()+n*6e4).toISOString()}function l(e){const t=o(),n=i("SELECT * FROM word_mastery WHERE player_id = ? AND word_id = ?",[t,e]);return n.length>0?n[0]:(s("INSERT INTO word_mastery (player_id, word_id, repetition_level, next_review_at, total_hits, total_errors) VALUES (?,?,?,NULL,0,0)",[t,e]),i("SELECT * FROM word_mastery WHERE player_id = ? AND word_id = ?",[t,e])[0])}function T(e,t){const n=o(),a=l(e);if(!a)return;let r=Number(a.repetition_level??0);const _=Number(a.total_hits??0)+(t.passed?1:0),d=Number(a.total_errors??0)+t.errorCount,c=a.avg_first_key_latency??0,m=t.passed?Math.round((c*_+t.latencyMs)/(_+1)):c;t.passed&&(t.stage==="recall"||t.stage==="dictation")&&t.latencyMs<p&&!t.usedHint?r=Math.min(7,r+1):(!t.passed||t.errorCount>2||t.usedHint)&&(r=Math.max(0,r-2)),w(`UPDATE word_mastery
     SET repetition_level = ?, next_review_at = ?, total_hits = ?, total_errors = ?,
         avg_first_key_latency = ?, last_practiced_at = ?
     WHERE player_id = ? AND word_id = ?`,[r,r>=1?u(r):null,_,d,m,y(),n,e])}function v(e,t){const n=o(),a=l(e);if(!a)return;const r=Number(a.repetition_level??0);s("UPDATE word_mastery SET repetition_level = ? WHERE player_id = ? AND word_id = ?",[Math.max(0,r-Math.ceil(r*t)),n,e])}function h(e){const t=o();l(e),s("UPDATE word_mastery SET total_errors = total_errors + 1 WHERE player_id = ? AND word_id = ?",[t,e])}function A(e=20){return i(`SELECT w.word, w.translation, m.repetition_level, m.next_review_at, m.total_hits, m.total_errors
     FROM word_mastery m JOIN words w ON w.id = m.word_id
     WHERE m.player_id = ? AND m.next_review_at IS NOT NULL
     ORDER BY m.next_review_at ASC LIMIT ?`,[o(),e])}function M(e=5){return i(`SELECT char_key, hit_count, error_count, avg_latency_ms,
            (error_count * 1.0 / MAX(1, hit_count + error_count)) AS err_rate
     FROM key_telemetry
     WHERE player_id = ? AND hit_count + error_count > 3
     ORDER BY err_rate DESC, avg_latency_ms DESC
     LIMIT ?`,[o(),e])}export{S as L,T as a,h as m,v as p,A as r,M as w};
