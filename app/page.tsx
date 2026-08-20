"use client";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

const questions = [
  ["Бір ұзақ жиналыста бәрін шешу", "Күні бойы бірнеше қысқа талқылау өткізу"],
  ["Түсінікті тапсырмалар мен жоспарлы күн", "Жаңа тапсырмалар мен аздап белгісіздік"],
  ["Шулы болса да, терезе жанында отыру", "Бұрышта болса да, тыныш жерде отыру"],
  ["Алдымен мәселені өзім шешіп көру", "Бірден әріптестен көмек сұрау"],
  ["Күнді нақты жоспармен өткізу", "Күнді жағдайға қарай икемдеу"],
  ["Туған күнді үлкен кешпен атап өту", "Туған күнді тыныш әрі шағын өткізу"],
  ["Таңғы асты үйде ішу", "Таңғы асты кеңседе ішу"],
  ["Жұмыстан кейін үйде демалу", "Жұмыстан кейін бір жерге шығу"],
  ["Басқа мамандықты байқап көру", "Мен осы мамандық үшін туғанмын"],
  ["Түскі үзілісте серуендеу", "Түскі үзілісте кеңседе демалу"],
  ["Қарбызды нанмен жеу", "Қарбызды нансыз жеу"],
] as const;
type Summary = { count:number; totals:number[][]; matches:{name:string;score:number}[]; latest:string[] };

export default function Home() {
  const [mode,setMode]=useState<"landing"|"start"|"quiz"|"result"|"stats">("landing");
  const [name,setName]=useState(""); const [index,setIndex]=useState(0); const [answers,setAnswers]=useState<number[]>([]); const [busy,setBusy]=useState(false); const [qr,setQr]=useState("");
  const [summary,setSummary]=useState<Summary>({count:0,totals:questions.map(()=>[0,0]),matches:[],latest:[]});
  const loadStats=async()=>{const r=await fetch("/api/answers",{cache:"no-store"});if(r.ok)setSummary(await r.json());};
  useEffect(()=>{const p=new URLSearchParams(location.search);if(p.get("screen")==="stats")setMode("stats");else if(p.get("play")==="1")setMode("start");loadStats();},[]);
  useEffect(()=>{if(mode!=="landing"&&mode!=="stats")return;if(mode==="landing")QRCode.toDataURL(location.origin+location.pathname+"?play=1",{width:360,margin:1,color:{dark:"#17142c",light:"#fffdf8"}}).then(setQr);const id=setInterval(loadStats,5000);return()=>clearInterval(id);},[mode]);
  const choose=async(answer:number)=>{const next=[...answers,answer];setAnswers(next);if(index<questions.length-1){setIndex(index+1);return;}setBusy(true);const r=await fetch("/api/answers",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:name.trim(),answers:next})});if(r.ok){setSummary(await r.json());setMode("result");}setBusy(false);};
  const reset=()=>{setMode("start");setName("");setIndex(0);setAnswers([]);};
  const popular=useMemo(()=>summary.totals.map((v,i)=>{const total=v[0]+v[1],winner=v[1]>v[0]?1:0;return{i,winner,pct:total?Math.round(v[winner]/total*100):0};}).sort((a,b)=>b.pct-a.pct)[0],[summary]);
  if(mode==="stats")return <Stats summary={summary} popular={popular}/>;
  if(mode==="landing")return <main className="landing-shell"><header className="brand-bar"><div className="brand-mark">A</div><div><strong>adamdar</strong><span>Кеңсе ойыны</span></div></header><section className="landing-grid"><div className="landing-copy"><p className="eyebrow">КЕҢСЕДЕГІ ТУҒАН КҮН</p><h1>Біз қаншалықты<br/><em>ұқсаспыз?</em></h1><p className="lead">QR-кодты сканерлеп, 11 сұраққа жауап беріңіз. Қай әріптесіңізбен ұқсастығыңыз көп екенін біліңіз.</p><div className="landing-actions"><a className="primary link-button" href="?play=1">Ойынға қатысу <span>→</span></a><a className="secondary-link" href="?screen=stats">Статистиканы көру</a></div></div><div className="qr-card landing-qr">{qr&&<img src={qr} alt="Ойынға қатысуға арналған QR-код"/>}<strong>Сканерле де қатыс</strong><span>Тіркелу қажет емес · шамамен 3 минут</span></div></section><p className="footer-note">Жауаптар тек жалпы статистикада көрсетіледі</p></main>;
  return <main className="app-shell"><header className="brand-bar"><div className="brand-mark">A</div><div><strong>adamdar</strong><span>Кеңсе ойыны</span></div><a className="screen-link" href="?screen=stats">Статистика экраны ↗</a></header>
    {mode==="start"&&<section className="hero-card"><p className="eyebrow">КЕҢСЕДЕГІ ТУҒАН КҮН</p><h1>Біз қаншалықты<br/><em>ұқсаспыз?</em></h1><p className="lead">11 жеңіл сұрақ. Бірнеше минут. Қай әріптесіңізбен ұқсастығыңыз көп екенін біліңіз.</p><form onSubmit={e=>{e.preventDefault();if(name.trim())setMode("quiz")}}><label className="name-label" htmlFor="name">Атыңыз кім?</label><input id="name" className="name-input" value={name} onChange={e=>setName(e.target.value)} maxLength={24} placeholder="Аты немесе лақап аты" required/><button className="primary" type="submit">Ойынды бастау <span>→</span></button></form><p className="privacy">Жауаптар тек жалпы статистикада көрсетіледі</p></section>}
    {mode==="quiz"&&<section className="hero-card quiz-card"><div className="quiz-top"><p className="eyebrow">{index+1}-СҰРАҚ / {questions.length}</p><span>{name}</span></div><div className="step-track"><div style={{width:`${(index+1)/questions.length*100}%`}}/></div><h2>Қайсысын таңдайсыз?</h2><div className="choice-grid"><button className="choice" onClick={()=>choose(0)} disabled={busy}>{questions[index][0]}</button><button className="choice accent" onClick={()=>choose(1)} disabled={busy}>{questions[index][1]}</button></div><p className="tap-note">Нұсқаны таңдаңыз — келесі сұрақ автоматты түрде ашылады</p></section>}
    {mode==="result"&&<section className="hero-card result-card"><p className="eyebrow">СІЗДІҢ НӘТИЖЕҢІЗ</p><h2>{name}, өз адамдарыңызды таптыңыз!</h2>{summary.count<3?<div className="waiting"><strong>Сіз алғашқы қатысушылардың бірісіз</strong><p>Тағы бірнеше әріптес ойынды аяқтағанда, сәйкестіктер көрсетіледі.</p></div>:<div className="match-list">{summary.matches.slice(0,3).map((m,i)=><div className="match" key={m.name+i}><span>#{i+1}</span><strong>{m.name}</strong><b>{m.score}/{questions.length}</b></div>)}</div>}<p className="result-copy">Қатысушылар саны: <strong>{summary.count}</strong>. Жалпы статистика жаңартылды.</p><button className="primary" onClick={reset}>Дайын — келесі адамға беру <span>→</span></button></section>}
    <p className="footer-note">Кез келген уақытта қатысуға болады — ойын шамамен 3 минут алады</p></main>;
}

function Stats({summary,popular}:{summary:Summary;popular:{i:number;winner:number;pct:number}}){return <main className="stats-shell"><header className="stats-header"><div className="brand-bar"><div className="brand-mark">A</div><div><strong>adamdar</strong><span>Кеңсе ойыны</span></div></div><nav className="stats-nav"><a href="/">QR-код</a><div className="live"><i/> АВТОМАТТЫ ТҮРДЕ ЖАҢАРАДЫ</div></nav></header><section className="stats-intro compact"><div><p className="eyebrow">ЖАЛПЫ КӨРІНІС</p><h1>Біз шын мәнінде<br/><em>осындаймыз</em></h1><p>Қатысушылардың нәтижелері мұнда автоматты түрде жаңарып отырады.</p></div></section><section className="stats-grid"><article className="stat-number"><span>Қатысқандар</span><strong>{summary.count}</strong><small>әріптес</small></article><article className="stat-highlight"><span>Ең ортақ таңдау</span><strong>{questions[popular?.i??0]?.[popular?.winner??0]}</strong><b>Бұл нұсқаны {popular?.pct??0}% таңдады</b></article></section><section className="bars"><div className="bars-title"><h2>Кеңсе нені таңдайды?</h2><span>{summary.count<3?"Статистика 3 қатысушыдан кейін көрсетіледі":"Барлық жауап жасырын"}</span></div>{questions.map((q,i)=>{const t=summary.totals[i]||[0,0],all=t[0]+t[1],p=all?Math.round(t[0]/all*100):50;return <div className="bar-row" key={q[0]}><div className="bar-labels"><span>{q[0]}</span><span>{q[1]}</span></div><div className="split"><i style={{width:`${p}%`}}/><b style={{width:`${100-p}%`}}/></div><div className="bar-pcts"><strong>{all?p:0}%</strong><strong>{all?100-p:0}%</strong></div></div>})}</section></main>}

