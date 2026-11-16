/* Edu.Care — site behaviour (no dependencies) */
(function(){
  "use strict";
  var ROOT = document.documentElement.getAttribute("data-root") || "";
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- theme ---------- */
  var stored = null; try{stored=localStorage.getItem("ec-theme")}catch(e){}
  if(stored){document.documentElement.setAttribute("data-theme",stored)}
  else if(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.setAttribute("data-theme","dark")}
  $$(".theme-toggle").forEach(function(b){b.addEventListener("click",function(){
    var t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",t); try{localStorage.setItem("ec-theme",t)}catch(e){}
  })});

  /* ---------- mobile menu ---------- */
  var mb=$(".menu-btn"), nl=$(".nav-links");
  if(mb&&nl){mb.addEventListener("click",function(){var o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)})}

  /* ---------- cookie consent ---------- */
  var ck=$(".cookie"); var consent=null; try{consent=localStorage.getItem("ec-consent")}catch(e){}
  if(ck&&!consent){ck.classList.add("show")}
  $$("[data-consent]").forEach(function(b){b.addEventListener("click",function(){
    try{localStorage.setItem("ec-consent",b.getAttribute("data-consent"))}catch(e){}
    if(b.getAttribute("data-consent")==="essential"){ (window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1; }
    ck.classList.remove("show");
  })});

  /* ---------- reveal on scroll ---------- */
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    $$(".reveal").forEach(function(el){io.observe(el)});
  } else { $$(".reveal").forEach(function(el){el.classList.add("in")}); }

  /* ---------- reading progress + back to top ---------- */
  var prog=$(".progress"), top=$(".to-top");
  window.addEventListener("scroll",function(){
    var h=document.documentElement, sc=h.scrollTop, mx=h.scrollHeight-h.clientHeight;
    if(prog) prog.style.width=(mx>0?sc/mx*100:0)+"%";
    if(top) top.classList.toggle("show",sc>600);
  },{passive:true});
  if(top) top.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});

  /* ---------- table of contents ---------- */
  var toc=$(".toc");
  if(toc){ $$(".prose h2").forEach(function(h,i){ if(!h.id) h.id="s"+(i+1); var a=document.createElement("a"); a.href="#"+h.id; a.textContent=h.textContent; toc.appendChild(a); }); }

  /* ---------- share ---------- */
  $$("[data-share]").forEach(function(b){b.addEventListener("click",function(){
    var u=encodeURIComponent(location.href), t=encodeURIComponent(document.title), k=b.getAttribute("data-share"), url="";
    if(k==="copy"){ if(navigator.clipboard){navigator.clipboard.writeText(location.href); b.textContent="Link copied ✓";} return; }
    if(k==="x") url="https://twitter.com/intent/tweet?url="+u+"&text="+t;
    if(k==="fb") url="https://www.facebook.com/sharer/sharer.php?u="+u;
    if(k==="li") url="https://www.linkedin.com/sharing/share-offsite/?url="+u;
    if(k==="wa") url="https://wa.me/?text="+t+"%20"+u;
    if(url) window.open(url,"_blank","noopener,width=600,height=520");
  })});

  /* ---------- lite YouTube embeds ---------- */
  function bindVideo(el){
    function play(){
      var id=el.getAttribute("data-yt");
      el.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(el.getAttribute("data-title")||"Video")+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }
    el.addEventListener("click",play,{once:true});
    el.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();play()}},{once:true});
  }
  $$(".video[data-yt]").forEach(bindVideo);

  function esc(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function fmtDate(d){var x=new Date(d); return isNaN(x)?"":x.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}

  /* ---------- auto-updated videos ---------- */
  $$("[data-videos]").forEach(function(box){
    var n=parseInt(box.getAttribute("data-videos"),10)||6, cat=box.getAttribute("data-cat");
    fetch(ROOT+"data/videos.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(d){
      var list=(d.videos||[]).filter(function(v){return !cat||v.category===cat}).slice(0,n);
      if(!list.length) return;
      box.innerHTML=list.map(function(v){return '<article class="card"><div class="video" data-yt="'+esc(v.id)+'" data-title="'+esc(v.title)+'" role="button" tabindex="0" aria-label="Play: '+esc(v.title)+'"><img loading="lazy" src="https://i.ytimg.com/vi/'+esc(v.id)+'/hqdefault.jpg" alt=""><div class="play"><span>▶</span></div></div><h3 style="font-size:1.05rem;margin-top:14px">'+esc(v.title)+'</h3><p class="card-meta">'+esc(v.channel)+' · '+fmtDate(v.published)+'</p></article>'}).join("");
      $$(".video[data-yt]",box).forEach(bindVideo);
    }).catch(function(){});
  });

  /* ---------- auto-updated news ---------- */
  $$("[data-news]").forEach(function(box){
    var n=parseInt(box.getAttribute("data-news"),10)||8;
    fetch(ROOT+"data/news.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(d){
      var list=(d.items||[]).slice(0,n); if(!list.length) return;
      box.innerHTML=list.map(function(i){return '<a class="news-item" href="'+esc(i.link)+'" target="_blank" rel="noopener nofollow"><h4>'+esc(i.title)+'</h4><span class="card-meta">'+esc(i.source)+' · '+fmtDate(i.published)+'</span></a>'}).join("");
      $$("[data-updated]").forEach(function(u){ if(d.updated) u.textContent="Updated "+fmtDate(d.updated); });
    }).catch(function(){});
  });

  /* ---------- tip of the day ---------- */
  var tipBox=$("[data-tip]");
  if(tipBox){ fetch(ROOT+"data/tips.json").then(function(r){return r.json()}).then(function(t){
    var day=Math.floor(Date.now()/864e5); var tip=t[day%t.length]; tipBox.innerHTML="<strong>"+esc(tip.t)+"</strong><br>"+esc(tip.d);
  }).catch(function(){}); }

  /* ---------- site search ---------- */
  var sIn=$("#site-search"), sOut=$("#search-results");
  if(sIn&&sOut){
    var idx=null;
    var run=function(){
      if(!idx) return; var q=sIn.value.trim().toLowerCase(); if(q.length<2){sOut.innerHTML="";return}
      var terms=q.split(/\s+/);
      var hits=idx.map(function(p){var hay=(p.title+" "+p.desc+" "+p.keywords).toLowerCase(),s=0;terms.forEach(function(t){if(hay.indexOf(t)>-1)s+=p.title.toLowerCase().indexOf(t)>-1?3:1});return {p:p,s:s}}).filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,12);
      sOut.innerHTML=hits.length?hits.map(function(h){return '<a class="news-item" href="'+ROOT+h.p.url+'"><h4>'+esc(h.p.title)+'</h4><span class="card-meta">'+esc(h.p.desc)+'</span></a>'}).join(""):'<p class="muted">No matches yet — try “GPA”, “scholarship”, “tutor” or “study”.</p>';
    };
    fetch(ROOT+"data/search.json").then(function(r){return r.json()}).then(function(d){idx=d; var q=new URLSearchParams(location.search).get("q"); if(q){sIn.value=q;run()}});
    sIn.addEventListener("input",run);
  }

  /* ---------- countdown to month end ---------- */
  $$("[data-countdown]").forEach(function(el){
    function end(){var n=new Date(); return new Date(n.getFullYear(),n.getMonth()+1,0,23,59,59)}
    function tick(){var ms=end()-new Date(); if(ms<0)ms=0; var d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;
      el.innerHTML="<div><b>"+d+"</b>days</div><div><b>"+h+"</b>hrs</div><div><b>"+m+"</b>min</div><div><b>"+s+"</b>sec</div>"}
    tick(); setInterval(tick,1000);
  });
  $$("[data-month]").forEach(function(el){el.textContent=new Date().toLocaleDateString(undefined,{month:"long",year:"numeric"})});
  $$("[data-year]").forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- donation amount picker ---------- */
  $$("[data-amount]").forEach(function(b){b.addEventListener("click",function(){
    var f=$("#amount"); if(f){f.value=b.getAttribute("data-amount");}
    var t=$("#pledge"); if(t) t.scrollIntoView({behavior:"smooth"});
  })});

  /* ---------- forms (delivered by FormSubmit; inbox never printed on the page) ---------- */
  var K=["bW9jLmxpYW1nQD","Fhc2tyb3diZXc="];
  function inbox(){ try{ return atob(K.join("")).split("").reverse().join(""); }catch(e){ return ""; } }
  function bar(f,i){ $$(".steps-bar span",f).forEach(function(s,j){s.classList.toggle("on",j<=i)}); }
  function resetSteps(f){ var st=$$(".step",f); if(!st.length)return; st.forEach(function(s,i){s.classList.toggle("active",i===0)}); f._cur=0; bar(f,0); }

  $$("form[data-form]").forEach(function(f){
    f.addEventListener("submit",function(ev){
      ev.preventDefault();
      var msg=$(".form-msg",f), btn=$("button[type=submit]",f);
      var hp=f.querySelector(".hp input"); if(hp && hp.value){return}
      if(!f.checkValidity()){f.reportValidity();return}
      var data={}; new FormData(f).forEach(function(v,k){ if(k==="_hp")return; data[k]=data[k]?data[k]+", "+v:v; });
      data._subject="Edu.Care — "+f.getAttribute("data-form")+" submission";
      data._template="table"; data._captcha="false";
      data.page=location.href;
      btn.disabled=true; var old=btn.textContent; btn.textContent="Sending…";
      fetch("https://formsubmit.co/ajax/"+inbox(),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
        .then(function(r){return r.json()})
        .then(function(){ msg.className="form-msg ok"; msg.textContent=f.getAttribute("data-ok")||"Thank you! We received your message and will reply soon."; f.reset(); resetSteps(f); })
        .catch(function(){ msg.className="form-msg err"; msg.textContent="Something went wrong. Please try again in a moment."; })
        .finally(function(){btn.disabled=false;btn.textContent=old});
    });
  });

  /* ---------- multi-step lead form ---------- */
  $$("form[data-steps]").forEach(function(f){
    var steps=$$(".step",f); f._cur=0;
    function go(n){
      var cur=f._cur;
      if(n>cur){
        var inputs=$$("input,select,textarea",steps[cur]);
        for(var i=0;i<inputs.length;i++){ if(!inputs[i].checkValidity()){inputs[i].reportValidity();return} }
      }
      steps[cur].classList.remove("active"); f._cur=n; steps[n].classList.add("active"); bar(f,n);
      var first=steps[n].querySelector("input,select,textarea"); if(first) first.focus({preventScroll:true});
    }
    $$("[data-next]",f).forEach(function(b){b.addEventListener("click",function(){go(f._cur+1)})});
    $$("[data-prev]",f).forEach(function(b){b.addEventListener("click",function(){go(f._cur-1)})});
    bar(f,0);
  });

  /* prefill interest from ?need= */
  var need=new URLSearchParams(location.search).get("need");
  if(need){ var r=document.querySelector('input[name="need"][value="'+need+'"]'); if(r) r.checked=true; }
})();
