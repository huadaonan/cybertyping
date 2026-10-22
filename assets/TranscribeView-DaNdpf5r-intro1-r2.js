import{d as Z,A as tt,x as at,K as rt,s as ct,B as dt,e as v,f as t,t as a,n as _,h as L,w as R,_ as K,F,r as P,q as f,l as j,J as ut,H as G,I as pt,m as x,v as D,L as ft,D as xt,g as H,j as U,M as Q,N as vt,O as mt,i as X,p as ht,z as gt}from"./index-9d92e3d2-r2.js";import{_ as yt}from"./SessionSummaryCard.vue_vue_type_script_setup_true_lang-S7X7YnXq-intro1-r2.js";import{_ as bt}from"./PagedGrid.vue_vue_type_script_setup_true_lang-C8Iyxles-intro1-r2.js";const kt={cpp:["auto","bool","break","case","catch","char","class","const","constexpr","continue","default","delete","do","double","else","enum","false","float","for","goto","if","inline","int","long","namespace","new","nullptr","operator","private","protected","public","return","short","signed","sizeof","static","struct","switch","template","this","throw","true","try","typedef","typename","union","unsigned","using","virtual","void","while","include","define","max","min","swap","push_back","size","begin","end","sort","reverse","abs","pow","cin","cout","endl","std","vector","string","pair","queue","stack","priority_queue","set","map","unordered_map","memset","first","second","emplace_back","find","count"],js:["const","let","var","function","return","if","else","for","while","class","import","export","from","new","async","await","try","catch","throw","typeof","null","undefined","true","false","this","of","in","do","switch","case","break","continue","default","delete","void","yield"],ts:["const","let","var","function","return","if","else","for","while","class","import","export","from","new","async","await","try","catch","throw","typeof","null","undefined","true","false","this","interface","type","extends","implements","readonly","public","private","protected","static","enum","namespace","as","is","keyof","infer"],python:["def","class","import","from","return","if","elif","else","for","while","in","not","and","or","None","True","False","lambda","try","except","finally","with","as","pass","raise","yield","global","assert","del","is","self"],sql:["select","from","where","insert","into","values","update","set","delete","create","table","drop","alter","join","left","right","inner","outer","on","group","by","order","having","limit","as","and","or","not","null","primary","key","foreign","references","distinct","count","sum","avg","asc","desc","index"],css:["important","media","root","var"]};function wt(d){if(d==="text")return[];const r=[];return d==="python"&&r.push({source:"#[^\\n]*",cls:"comment"}),d==="sql"&&r.push({source:"--[^\\n]*",cls:"comment"}),(d==="js"||d==="ts"||d==="cpp")&&(r.push({source:"//[^\\n]*",cls:"comment"}),r.push({source:"/\\*[\\s\\S]*?\\*/",cls:"comment"})),d==="cpp"&&r.push({source:"#[^\\n]*",cls:"preprocessor"}),d!=="sql"&&r.push({source:"\"(?:[^\"\\\\\\n]|\\\\.)*\"?|'(?:[^'\\\\\\n]|\\\\.)*'?|`(?:[^`\\\\]|\\\\.)*`?",cls:"string"}),d==="css"&&r.push({source:"--[\\w-]+",cls:"variable"}),r.push({source:"\\b\\d[\\w.]*\\b",cls:"number"}),r.push({source:`\\b(?:${kt[d].join("|")})\\b`,cls:"keyword"}),r}function _t(d,r){if(r==="text")return[{text:d,cls:""}];const h=wt(r).map(o=>({cls:o.cls,re:new RegExp(o.source,"g")})),u=[];let c="",m=0;for(;m<d.length;){let o=!1;for(const y of h){y.re.lastIndex=m;const g=y.re.exec(d);if(g&&g.index===m&&g[0].length>0){c&&(u.push({text:c,cls:""}),c=""),u.push({text:g[0],cls:y.cls}),m+=g[0].length,o=!0;break}}o||(c+=d[m],m++)}return c&&u.push({text:c,cls:""}),u}const jt={class:"flex h-full flex-col gap-3"},St={class:"panel flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-2.5 text-sm"},$t={class:"font-bold text-cyber"},Ct={class:"text-text-dim"},Tt={class:"font-mono text-text-main"},Mt={class:"text-text-dim"},Nt={class:"font-mono text-cyber"},qt={class:"text-text-dim"},Et={class:"font-mono text-purple"},Lt={class:"text-text-dim"},Rt={class:"font-mono text-amber"},Ft={class:"text-text-dim"},Pt={class:"font-mono text-text-main"},Dt={class:"grid min-h-0 flex-1 grid-cols-2 gap-3"},It={class:"panel relative min-h-0 overflow-hidden"},Kt={class:"absolute left-3 top-2 z-10 rounded bg-void/70 px-1.5 py-0.5 text-[10px] tracking-widest text-text-dim"},Bt={class:"whitespace-pre-wrap p-4 pt-8 font-mono text-[13px] leading-relaxed"},Vt={class:"pointer-events-none absolute inset-0 whitespace-pre-wrap p-4 pt-8 font-mono text-[13px] leading-relaxed text-transparent"},zt={class:"panel relative min-h-0 overflow-hidden"},At={class:"h-full overflow-auto p-4 pt-8"},Wt={class:"min-h-full whitespace-pre-wrap font-mono text-[13px] leading-relaxed"},Ot={key:1,class:"text-text-dim"},Ut=Z({__name:"TranscribeRunner",props:{title:{},content:{},lang:{},kind:{}},emits:["finished"],setup(d,{emit:r}){const h=d,u=r,c=tt(),m=at(),o=f(""),y=f(0),g=f(0),N=f(0),E=f(0),S=f(!1),I=f(null);let b=0,w=null;const C=f({}),q=f({}),T=j(()=>h.content),B=j(()=>T.value.length),V=j(()=>Math.min(100,Math.round(o.value.length/Math.max(1,B.value)*100))),i=j(()=>_t(T.value,h.lang).map(e=>({...e,text:e.text.replace(/ /g,"·​")}))),s=j(()=>T.value.split("").map((e,n)=>({idx:n,ch:e==="	"?"    ":e===" "?"·​":e}))),M=j(()=>o.value.split("").map((e,n)=>({ch:e===`
`?`⏎
`:e===" "?"·​":e,ok:e===T.value[n]})));function p(){b&&!S.value&&(E.value=(performance.now()-b)/1e3)}const k=j(()=>{const e=y.value+g.value;return e===0?null:Math.round(y.value/e*100)}),z=j(()=>{const e=y.value+g.value+N.value;return e===0?null:Math.round(N.value/e*100)}),et=j(()=>E.value<5||b===0?0:Math.round(o.value.length/5/(E.value/60)));rt(()=>o.value.length,async()=>{var n;await ft();const e=(n=I.value)==null?void 0:n.querySelector('[data-cursor="1"]');e==null||e.scrollIntoView({block:"nearest"})});function A(e){if(S.value)return;S.value=!0,w&&clearInterval(w),window.removeEventListener("keydown",W,!0);const n=b?(performance.now()-b)/1e3:0,l=n/60,$=y.value+g.value,nt=l>0?Math.round(o.value.length/5/l):0,st=l>0?Math.round($/5/l):0,ot=$===0?0:Math.round(y.value/$*100),J=$+N.value,it=J===0?0:Math.round(N.value/J*100),lt=c.stats().maxCombo;ut(C.value,q.value,{}),c.reset(),u("finished",{completed:e,durationSeconds:Math.round(n),netWpm:nt,grossWpm:st,accuracy:ot,reworkRate:it,keystrokes:$,maxCombo:lt})}function W(e){if(!S.value){if(e.key==="Escape"){e.preventDefault(),A(!1);return}if(!document.hidden&&!(e.ctrlKey||e.metaKey||e.altKey)){if(b||(b=performance.now(),p()),e.key==="Tab"){e.preventDefault();for(const n of"  ")O(n);return}if(e.key==="Enter"){e.preventDefault(),O(`
`);return}if(e.key==="Backspace"){e.preventDefault(),o.value.length>0&&(N.value++,G(!0),o.value=o.value.slice(0,-1));return}e.key.length===1&&(e.preventDefault(),O(e.key))}}}function O(e){const n=T.value[o.value.length],l=e===n;l?(y.value++,C.value[e]=(C.value[e]??0)+1):(g.value++,n!==void 0&&(q.value[n]=(q.value[n]??0)+1)),c.reportKey(l),G(l),o.value+=e,o.value===T.value&&(pt("level"),A(!0))}return ct(()=>{xt(m.soundPreset,m.soundVolume),c.begin(),window.addEventListener("keydown",W,!0),w=setInterval(p,500)}),dt(()=>{w&&clearInterval(w),window.removeEventListener("keydown",W,!0),c.reset()}),(e,n)=>(x(),v("div",jt,[t("div",St,[t("span",$t,a(d.title),1),t("span",Ct,[n[1]||(n[1]=_("进度 ",-1)),t("b",Tt,a(V.value)+"%",1)]),t("span",Mt,[n[2]||(n[2]=_("速度 ",-1)),t("b",Nt,a(et.value)+" WPM",1)]),t("span",qt,[n[3]||(n[3]=_("正确率 ",-1)),t("b",Et,a(k.value===null?"—":k.value+"%"),1)]),t("span",Lt,[n[4]||(n[4]=_("返工率 ",-1)),t("b",Rt,a(z.value===null?"—":z.value+"%"),1)]),t("span",Ft,[n[5]||(n[5]=_("用时 ",-1)),t("b",Pt,a(Math.round(E.value))+"s",1)]),L(K,{variant:"ghost",small:"",class:"ml-auto",onClick:n[0]||(n[0]=l=>A(!1))},{default:R(()=>[...n[6]||(n[6]=[_("[Esc] 结束",-1)])]),_:1})]),t("div",Dt,[t("div",It,[t("div",Kt," 原文 · "+a(h.kind==="code"?h.lang.toUpperCase():"TEXT"),1),t("div",{ref_key:"contentRef",ref:I,class:"relative h-full overflow-auto"},[t("pre",Bt,[(x(!0),v(F,null,P(i.value,(l,$)=>(x(),v("span",{key:$,class:D({"text-text-dim italic":l.cls==="comment","text-amber":l.cls==="string","text-purple":l.cls==="number","text-cyber":l.cls==="keyword","text-ice":l.cls==="variable"})},a(l.text),3))),128))]),t("pre",Vt,[(x(!0),v(F,null,P(s.value,l=>(x(),v("span",{key:l.idx,"data-cursor":"",class:D(l.idx<o.value.length?"bg-void/70":l.idx===o.value.length?"rounded-sm bg-cyber/40":"")},a(l.ch),3))),128)),n[7]||(n[7]=t("span",{class:"bg-cyber/40 text-transparent"},"▍",-1))])],512)]),t("div",zt,[n[9]||(n[9]=t("div",{class:"absolute left-3 top-2 z-10 rounded bg-void/70 px-1.5 py-0.5 text-[10px] tracking-widest text-text-dim"}," 你的抄写 · 照左边的原文打字 ",-1)),t("div",At,[t("pre",Wt,[o.value?(x(),v(F,{key:0},[(x(!0),v(F,null,P(M.value,(l,$)=>(x(),v("span",{key:$,class:D(l.ok?"text-cyber":"rounded bg-error/25 text-error")},a(l.ch),3))),128)),n[8]||(n[8]=t("span",{class:"animate-pulse bg-cyber/70 text-transparent"},"▍",-1))],64)):(x(),v("span",Ot,"在键盘上开始抄写…（Tab = 2 空格，Esc = 结束）"))])])])])]))}}),Y=[{id:"cpp-quick-sort",title:"快排 · quick_sort",kind:"code",lang:"cpp",tag:"分治",content:`// 快速排序：平均 O(n log n)
void quickSort(int a[], int l, int r) {
    if (l >= r) return;
    int i = l - 1, j = r + 1;
    int x = a[(l + r) >> 1];
    while (i < j) {
        do i++; while (a[i] < x);
        do j--; while (a[j] > x);
        if (i < j) swap(a[i], a[j]);
    }
    quickSort(a, l, j);
    quickSort(a, j + 1, r);
}`},{id:"cpp-prefix-sum",title:"前缀和 · 一维",kind:"code",lang:"cpp",tag:"前缀和",content:`// 前缀和：S[i] = a[1] + ... + a[i]
int s[N];
s[0] = 0;
for (int i = 1; i <= n; i++) {
    s[i] = s[i - 1] + a[i];
}

// 询问 [l, r] 区间和：O(1)
int query(int l, int r) {
    return s[r] - s[l - 1];
}`},{id:"cpp-binary-search",title:"二分查找 · 整数边界",kind:"code",lang:"cpp",tag:"二分",content:`// 二分：找左边界（最小可行解）
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) >> 1;
    if (check(mid)) r = mid;
    else l = mid + 1;
}
// l 即为答案

// 二分：找右边界（最大可行解）
int l2 = 1, r2 = n + 1;
while (l2 < r2) {
    int mid = (l2 + r2 + 1) >> 1;
    if (check(mid)) l2 = mid;
    else r2 = mid - 1;
}`},{id:"cpp-bfs",title:"BFS · 走迷宫最短路",kind:"code",lang:"cpp",tag:"搜索",content:`// BFS：网格最短路，队列保证层序
int dist[N][N];
pair<int, int> q[N * N];
int hh = 0, tt = -1;

memset(dist, -1, sizeof dist);
dist[0][0] = 0;
q[++tt] = {0, 0};

while (hh <= tt) {
    auto [x, y] = q[hh++];
    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d], ny = y + dy[d];
        if (nx < 0 || ny < 0) continue;
        if (g[nx][ny] == '#' || dist[nx][ny] != -1) continue;
        dist[nx][ny] = dist[x][y] + 1;
        q[++tt] = {nx, ny};
    }
}`},{id:"cpp-dfs-permutation",title:"DFS · 全排列",kind:"code",lang:"cpp",tag:"搜索",content:`// DFS：按字典序输出 1~n 的全排列
int path[N];
bool used[N];

void dfs(int u) {
    if (u == n) {
        for (int i = 0; i < n; i++) {
            cout << path[i] << " ";
        }
        cout << endl;
        return;
    }
    for (int i = 1; i <= n; i++) {
        if (!used[i]) {
            path[u] = i;
            used[i] = true;
            dfs(u + 1);
            used[i] = false;   // 恢复现场
        }
    }
}`},{id:"cpp-dp-lis",title:"DP · 最长上升子序列",kind:"code",lang:"cpp",tag:"动态规划",content:`// LIS：f[i] 表示以 a[i] 结尾的最长上升子序列长度
int f[N];
int ans = 0;

for (int i = 0; i < n; i++) {
    f[i] = 1;
    for (int j = 0; j < i; j++) {
        if (a[j] < a[i]) {
            f[i] = max(f[i], f[j] + 1);
        }
    }
    ans = max(ans, f[i]);
}
cout << ans << endl;`},{id:"cpp-kmp",title:"KMP · 字符串匹配",kind:"code",lang:"cpp",tag:"字符串",content:`// KMP：求 next 数组 + 文本串匹配
void getNext(char p[], int ne[]) {
    int m = strlen(p);
    ne[0] = -1;
    for (int i = 1, j = -1; i < m; i++) {
        while (j != -1 && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }
}

int find(char s[], char p[]) {
    getNext(p, ne);
    for (int i = 0, j = -1; s[i]; i++) {
        while (j != -1 && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
        if (p[j + 1] == 0) return i - j;   // 匹配成功
    }
    return -1;
}`},{id:"cpp-dsu",title:"并查集 · 路径压缩",kind:"code",lang:"cpp",tag:"图论",content:`// 并查集：查找 + 合并（路径压缩）
int p[N];

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void merge(int a, int b) {
    p[find(a)] = find(b);
}

// 初始化
for (int i = 1; i <= n; i++) p[i] = i;`},{id:"cpp-keywords",title:"关键字 · C++ 基础类型与控制流",kind:"code",lang:"cpp",tag:"关键字",content:`// 基础类型与控制流关键字速写
int count = 0;
long long total = 0;
double ratio = 0.5;
char grade = 'A';
bool found = false;

for (int i = 0; i < n; i++) count += i;
while (count > 0) count--;
if (found) return true;
else continue;
switch (grade) {
    case 'A': break;
    default: break;
}
struct Point { int x, y; };
return sizeof(int);`},{id:"cpp-operators-arith",title:"运算符 · 算术与位运算",kind:"code",lang:"cpp",tag:"运算符",content:`// 算术与位运算符：+ - * / % ++ --
int a = 17, b = 5;
int sum = a + b;        // 22
int diff = a - b;       // 12
int prod = a * b;       // 85
int quot = a / b;       // 3
int rem = a % b;        // 2
a++; b--; a += b; a -= 2;
a *= 2; a /= 4; a %= 7;

int bits = 0xF0;
int lo = bits & 0x0F;   // 与
int hi = bits | 0x0F;   // 或
int fl = bits ^ 0xFF;   // 异或
int sh = bits << 2;     // 左移
int sr = bits >> 2;     // 右移
int not_ = ~bits;       // 取反`},{id:"cpp-operators-logic",title:"运算符 · 比较与逻辑",kind:"code",lang:"cpp",tag:"运算符",content:`// 比较与逻辑运算符：== != < > <= >= && || !
int x = 3, y = 7;
bool eq = x == y;          // false
bool ne = x != y;          // true
bool lt = x < y;           // true
bool gt = x > y;           // false
bool le = x <= y;          // true
bool ge = x >= y;          // false

bool both = lt && le;      // 与
bool either = gt || ge;    // 或
bool neg = !eq;            // 非
if (x >= 0 && x <= 9) {
    while (!(x == y)) x++;
}
return (x != y) ? 1 : 0;   // 三目`},{id:"cpp-operators-assign",title:"运算符 · 赋值与自增",kind:"code",lang:"cpp",tag:"运算符",content:`// 赋值运算符全家桶：= += -= *= /= %= <<= >>=
int n = 10;
n += 5;   // 15
n -= 3;   // 12
n *= 2;   // 24
n /= 4;   // 6
n %= 4;   // 2
n <<= 3;  // 16
n >>= 1;  // 8
n &= 0x0F;
n |= 0x10;
n ^= 0xFF;

int i = 0;
int pre = ++i;   // 先加后取：1
int post = i++;  // 先取后加：1，i=2
while (i-- > 0) {
    if (i == 0) break;
}`},{id:"text-neon",title:"短文 · Neon City",kind:"text",lang:"text",tag:"短文",content:`The neon city never sleeps. Rain slides down the glass towers, and every window hides a story waiting to be typed. Somewhere above the traffic, a signal blinks in green and violet, patient as a heartbeat.

You sit at the keyboard, hands resting on the home row. Each keystroke is a small act of rhythm, and the screen answers with light. Type on, and let the noise of the world fall away.`},{id:"text-cadet",title:"短文 · The Cadet",kind:"text",lang:"text",tag:"短文",content:`Every cadet begins with the same lesson: trust your hands, not your eyes. The letters will come, slowly at first, then all at once, like a circuit finally closing.

Mistakes are part of the signal. A wrong key is only a whisper from the one you meant, and every backspace is a promise to try again. Keep your wrists light, your eyes forward, and your mind on the rhythm of the keys.`}],Yt={class:"mx-auto h-full w-4/5 max-w-none"},Jt={key:0,class:"flex flex-col gap-4"},Gt={class:"panel p-5"},Ht={class:"flex flex-wrap items-center justify-between gap-3"},Qt=["disabled"],Xt={class:"mt-1 text-xs font-bold tracking-widest"},Zt={key:0,class:"mt-0.5 font-mono text-[10px] opacity-80"},te={class:"flex items-center justify-between"},ee={key:0,class:"panel p-4"},ne={class:"mb-2 flex items-center gap-2 text-xs text-text-dim"},se={class:"ml-auto font-mono"},oe={class:"mt-2 flex items-center justify-between"},ie={class:"text-xs text-error"},le={class:"grid gap-3 md:grid-cols-2 xl:grid-cols-3"},ae=["onClick"],re={class:"flex items-center justify-between"},ce={class:"text-sm font-bold text-cyber"},de={class:"rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-text-dim"},ue={class:"mt-1.5 flex items-center gap-2"},pe={class:"rounded bg-purple/15 px-1.5 py-0.5 text-[10px] text-purple"},fe={class:"text-[10px] text-text-dim"},xe={class:"mt-2 truncate font-mono text-[11px] text-text-dim"},ve={class:"grid gap-3 md:grid-cols-2"},me=["onClick"],he={class:"text-sm font-bold text-gold"},ge={class:"mt-2 line-clamp-2 text-[11px] leading-relaxed text-text-dim"},ye={class:"mt-2 text-[10px] text-text-dim"},be={key:2,class:"mx-auto mt-10 w-4/5 max-w-[560px]"},ke={class:"mt-4 flex justify-center gap-3"},Se=Z({__name:"TranscribeView",setup(d){tt();const r=f("select"),h=f(null),u=f(null),c=f(!1),m=f(null);let o=null;const y=Y.filter(i=>i.kind==="code"),g=f(1),N=Y.filter(i=>i.kind==="text"),E=j(()=>Y.filter(i=>i.kind==="code"));function S(i){h.value=i,u.value=null,r.value="run"}function I(){if(c.value)return;c.value=!0;let i=0;o=setInterval(()=>{const s=E.value,M=s[Math.floor(Math.random()*s.length)];m.value={title:M.title,tag:M.tag},i++,i>=16&&(o&&clearInterval(o),c.value=!1,S(M))},50)}const b=f(!1),w=f(""),C=f("text"),q=f("");function T(){const i=w.value.replace(/\r\n/g,`
`).trim();if(i.length<20){q.value="内容太短，至少 20 个字符";return}if(i.length>3e3){q.value="内容太长，最多 3000 个字符";return}S({title:"自定义内容",content:i,lang:C.value,kind:C.value==="text"?"text":"code"})}function B(i){u.value=i,gt("code",i.durationSeconds,i.netWpm,i.accuracy,i.maxCombo,i.keystrokes),r.value="over"}const V={cpp:"C++",js:"JS",ts:"TS",python:"PY",sql:"SQL",css:"CSS",text:"TXT"};return(i,s)=>{var M;return x(),v("div",Yt,[r.value==="select"?(x(),v("div",Jt,[t("div",Gt,[t("div",Ht,[s[5]||(s[5]=H('<div><h1 class="text-lg font-bold tracking-[0.3em] text-cyber neon-text">抄写练习 · TRANSCRIBE</h1><p class="mt-2 max-w-2xl text-xs leading-relaxed text-text-dim"> 左边原文（代码带语法高亮），右边照着抄。按 <b class="text-cyber">速度</b>、<b class="text-purple">正确率</b>（一次敲对的比例）、<b class="text-amber">返工率</b>（删除重打占比）三维评分；Tab 键 = 2 空格缩进，Esc 结束。内置信奥 C++ 典型片段，支持随机 roll 与粘贴自定义内容。 </p></div>',1)),t("button",{class:D(["clip-corner shrink-0 border-2 px-6 py-4 text-center transition-all",c.value?"border-gold text-gold":"border-purple text-purple hover:bg-purple/10 hover:shadow-[0_0_20px_rgba(189,0,255,0.4)]"]),disabled:c.value,onClick:I},[t("div",{class:D(["text-2xl",c.value?"animate-pulse":""])},"🎲",2),t("div",Xt,a(c.value?m.value?`ROLLING… ${m.value.tag}`:"ROLLING…":"随机 ROLL"),1),c.value&&m.value?(x(),v("div",Zt,a(m.value.title),1)):U("",!0)],10,Qt)])]),t("div",te,[s[6]||(s[6]=t("h2",{class:"text-sm font-bold tracking-widest text-purple"},"信奥 C++ 典型片段",-1)),L(K,{small:"",variant:"ghost",onClick:s[0]||(s[0]=p=>b.value=!b.value)},{default:R(()=>[_(a(b.value?"收起自定义":"⌗ 粘贴自定义内容"),1)]),_:1})]),b.value?(x(),v("div",ee,[t("div",ne,[s[8]||(s[8]=_(" 语言： ",-1)),Q(t("select",{"onUpdate:modelValue":s[1]||(s[1]=p=>C.value=p),class:"rounded border border-line bg-void px-2 py-1 text-text-main outline-none"},[...s[7]||(s[7]=[H('<option value="text">纯文本</option><option value="cpp">C++（信奥）</option><option value="js">JavaScript</option><option value="ts">TypeScript</option><option value="python">Python</option><option value="sql">SQL</option><option value="css">CSS</option>',7)])],512),[[vt,C.value]]),t("span",se,a(w.value.length)+"/3000",1)]),Q(t("textarea",{"onUpdate:modelValue":s[2]||(s[2]=p=>w.value=p),rows:"5",placeholder:"粘贴要抄写的代码或短文…",class:"w-full rounded-lg border border-line bg-void/60 p-3 font-mono text-xs text-text-main outline-none placeholder:text-text-dim focus:border-cyber"},null,512),[[mt,w.value]]),t("div",oe,[t("span",ie,a(q.value),1),L(K,{small:"",disabled:w.value.trim().length<20,onClick:T},{default:R(()=>[...s[9]||(s[9]=[_("用这段开始 →",-1)])]),_:1},8,["disabled"])])])):U("",!0),L(bt,{page:g.value,"onUpdate:page":s[3]||(s[3]=p=>g.value=p),items:X(y),"page-size":6},{default:R(({items:p})=>[t("div",le,[(x(!0),v(F,null,P(p,k=>(x(),v("div",{key:k.id,class:"panel cursor-pointer p-4 transition-all hover:border-cyber/60",onClick:z=>S(k)},[t("div",re,[t("h3",ce,a(k.title),1),t("span",de,a(V[k.lang]),1)]),t("div",ue,[t("span",pe,a(k.tag),1),t("span",fe,a(k.content.length)+" 字符",1)]),t("p",xe,a(k.content.split(`
`)[1]||k.content.split(`
`)[0]),1)],8,ae))),128))])]),_:1},8,["page","items"]),s[10]||(s[10]=t("h2",{class:"text-sm font-bold tracking-widest text-gold"},"英文短文",-1)),t("div",ve,[(x(!0),v(F,null,P(X(N),p=>(x(),v("div",{key:p.id,class:"panel cursor-pointer p-4 transition-all hover:border-gold/60",onClick:k=>S(p)},[t("h3",he,a(p.title),1),t("p",ge,a(p.content),1),t("div",ye,a(p.content.length)+" 字符 · "+a(p.content.split(" ").length)+" 词",1)],8,me))),128))])])):r.value==="run"&&h.value?(x(),ht(Ut,{key:1,title:h.value.title,content:h.value.content,lang:h.value.lang,kind:h.value.kind,onFinished:B},null,8,["title","content","lang","kind"])):r.value==="over"&&u.value?(x(),v("div",be,[L(yt,{label:`${((M=h.value)==null?void 0:M.title)??"抄写"} · ${u.value.completed?"抄写完成":"提前结束（未抄完）"}`,wpm:u.value.netWpm,accuracy:u.value.accuracy,keystrokes:u.value.keystrokes,combo:u.value.maxCombo,stars:0,extra:`毛速度 ${u.value.grossWpm} WPM · 返工率 ${u.value.reworkRate}% · 用时 ${u.value.durationSeconds}s · 共 ${u.value.keystrokes} 次输入`},{footer:R(()=>[t("div",ke,[L(K,{onClick:s[4]||(s[4]=p=>r.value="select")},{default:R(()=>[...s[11]||(s[11]=[_("返回选择",-1)])]),_:1})])]),_:1},8,["label","wpm","accuracy","keystrokes","combo","extra"]),s[12]||(s[12]=t("div",{class:"panel mt-4 p-4 text-xs leading-relaxed text-text-dim"},[t("b",{class:"text-text-main"},"评分说明："),_(" 净速度 = 原文字符数 ÷ 5 ÷ 净用时；正确率 = 一次敲对的字符 ÷ 全部输入；返工率 = 退格次数 ÷ 总击键（含退格）——返工率越低说明一遍过能力越强。 ")],-1))])):U("",!0)])}}});export{Se as default};
