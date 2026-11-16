/* Edu.Care — interactive learning tools */
(function(){
  "use strict";
  var $=function(s){return document.querySelector(s)};
  var ROOT=document.documentElement.getAttribute("data-root")||"";
  var money=function(n){return isFinite(n)?n.toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0}):"—"};

  /* ---------- GPA calculator ---------- */
  if($("#gpa")){
    var PTS={"A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D+":1.3,"D":1.0,"D-":0.7,"F":0};
    var BONUS={reg:0,hon:0.5,ap:1.0};
    var list=$("#gpa-rows");
    var calc=function(){
      var tc=0,uw=0,w=0;
      Array.prototype.forEach.call(list.children,function(r){
        var s=r.querySelectorAll("select"), c=parseFloat(r.querySelectorAll("input")[1].value)||0, p=PTS[s[0].value];
        tc+=c; uw+=p*c; w+=(p>0?p+BONUS[s[1].value]:0)*c;
      });
      var pc=parseFloat($("#gpa-prior").value), pcr=parseFloat($("#gpa-prior-cr").value);
      if(pc>=0&&pcr>0){uw+=pc*pcr;w+=pc*pcr;tc+=pcr}
      $("#gpa-uw").textContent=tc?(uw/tc).toFixed(2):"0.00";
      $("#gpa-w").textContent=tc?(w/tc).toFixed(2):"0.00";
      $("#gpa-cr").textContent=tc;
    };
    var row=function(){
      var d=document.createElement("div"); d.className="course-row";
      d.innerHTML='<input aria-label="Course name" placeholder="Course (optional)">'+
        '<select aria-label="Grade">'+Object.keys(PTS).map(function(g){return "<option>"+g+"</option>"}).join("")+'</select>'+
        '<input aria-label="Credits" type="number" min="0" step="0.5" value="1">'+
        '<select aria-label="Course level"><option value="reg">Regular</option><option value="hon">Honors (+0.5)</option><option value="ap">AP/IB (+1.0)</option></select>'+
        '<button type="button" class="icon-btn" aria-label="Remove course">✕</button>';
      d.querySelector("button").onclick=function(){d.remove();calc()};
      d.addEventListener("input",calc); d.addEventListener("change",calc); list.appendChild(d);
    };
    $("#gpa-add").onclick=function(){row();calc()};
    $("#gpa-prior").oninput=calc; $("#gpa-prior-cr").oninput=calc;
    for(var i=0;i<5;i++)row(); calc();
  }

  /* ---------- final exam grade needed ---------- */
  if($("#final")){
    var fcalc=function(){
      var cur=parseFloat($("#fg-cur").value), want=parseFloat($("#fg-want").value), wt=parseFloat($("#fg-wt").value)/100;
      var out=$("#fg-out"), note=$("#fg-note");
      if(!(wt>0&&wt<=1)||isNaN(cur)||isNaN(want)){out.textContent="—";return}
      var need=(want-(1-wt)*cur)/wt; out.textContent=need.toFixed(1)+"%";
      note.textContent= need>100?"Above 100% — talk to your teacher about extra credit, or adjust your target.": need<=0?"You've already secured this grade. Keep going!":"This is the score you need on the final exam to reach your target.";
    };
    ["#fg-cur","#fg-want","#fg-wt"].forEach(function(s){$(s).addEventListener("input",fcalc)}); fcalc();
  }

  /* ---------- student loan repayment ---------- */
  if($("#loan")){
    var lcalc=function(){
      var P=parseFloat($("#ln-amt").value)||0, r=(parseFloat($("#ln-rate").value)||0)/100/12, n=(parseFloat($("#ln-yrs").value)||10)*12, extra=parseFloat($("#ln-extra").value)||0;
      var pay=r?P*r/(1-Math.pow(1+r,-n)):P/n;
      var bal=P,months=0,interest=0, p2=pay+extra;
      while(bal>0.01&&months<1200){var it=bal*r;interest+=it;bal=bal+it-p2;months++}
      $("#ln-pay").textContent=money(pay);
      $("#ln-total").textContent=money(pay*n);
      $("#ln-int").textContent=money(pay*n-P);
      $("#ln-save").textContent=extra>0?("Paying "+money(extra)+" extra each month clears the loan in "+(months/12).toFixed(1)+" years and saves about "+money(pay*n-P-interest)+" in interest."):"Add an extra monthly amount to see time and interest saved.";
    };
    ["#ln-amt","#ln-rate","#ln-yrs","#ln-extra"].forEach(function(s){$(s).addEventListener("input",lcalc)}); lcalc();
  }

  /* ---------- college savings goal ---------- */
  if($("#save")){
    var scalc=function(){
      var goal=parseFloat($("#sv-goal").value)||0, yrs=parseFloat($("#sv-yrs").value)||1, have=parseFloat($("#sv-have").value)||0, rate=(parseFloat($("#sv-rate").value)||0)/100/12, n=yrs*12;
      var fvHave=have*Math.pow(1+rate,n), gap=Math.max(goal-fvHave,0);
      var m=rate?gap*rate/(Math.pow(1+rate,n)-1):gap/n;
      $("#sv-out").textContent=money(m);
      $("#sv-note").textContent="per month for "+yrs+" years (your current savings grow to about "+money(fvHave)+").";
    };
    ["#sv-goal","#sv-yrs","#sv-have","#sv-rate"].forEach(function(x){$(x).addEventListener("input",scalc)}); scalc();
  }

  /* ---------- focus timer (Pomodoro) ---------- */
  var tm=$("#timer");
  if(tm){
    var mode="focus", left=25*60, t=null, done=0, D={focus:25,short:5,long:15};
    var show=function(){var m=Math.floor(left/60),s=left%60; tm.textContent=(m<10?"0":"")+m+":"+(s<10?"0":"")+s; document.title=tm.textContent+" · Focus Timer · Edu.Care"};
    var stop=function(){clearInterval(t);t=null;$("#tm-start").textContent="Start"};
    var beep=function(){try{var a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.15;o.start();o.stop(a.currentTime+.6)}catch(e){}};
    var set=function(m){mode=m;left=D[m]*60;stop();show();document.querySelectorAll("[data-mode]").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-mode")===m)})};
    $("#tm-start").onclick=function(){
      if(t){stop();return}
      $("#tm-start").textContent="Pause";
      t=setInterval(function(){left--;show(); if(left<=0){stop();beep();
        if(mode==="focus"){done++;$("#tm-done").textContent=done;set(done%4===0?"long":"short")}else set("focus");}},1000);
    };
    $("#tm-reset").onclick=function(){set(mode)};
    document.querySelectorAll("[data-mode]").forEach(function(b){b.onclick=function(){set(b.getAttribute("data-mode"))}});
    ["focus","short","long"].forEach(function(k){var i=$("#tm-"+k); if(i) i.oninput=function(){D[k]=Math.max(1,parseInt(i.value,10)||1); if(mode===k&&!t){left=D[k]*60;show()}}});
    show();
  }

  /* ---------- scholarship finder ---------- */
  var sf=$("#sch-table");
  if(sf){
    var all=[];
    var esc=function(x){return String(x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
    var draw=function(){
      var q=$("#sch-q").value.toLowerCase(), lv=$("#sch-level").value, co=$("#sch-country").value;
      var rows=all.filter(function(s){return (!lv||s.level.indexOf(lv)>-1)&&(!co||s.country===co)&&(!q||(s.name+" "+s.focus+" "+s.who).toLowerCase().indexOf(q)>-1)});
      $("#sch-count").textContent=rows.length+" programs";
      sf.innerHTML=rows.map(function(s){return "<tr><td><strong>"+esc(s.name)+"</strong><br><span class='card-meta'>"+esc(s.focus)+"</span></td><td>"+esc(s.who)+"</td><td>"+esc(s.level.join(", "))+"</td><td>"+esc(s.country)+"</td><td><a href='"+esc(s.url)+"' target='_blank' rel='noopener nofollow'>Official site ↗</a></td></tr>"}).join("");
    };
    fetch(ROOT+"data/scholarships.json").then(function(r){return r.json()}).then(function(d){
      all=d; var cs=[]; d.forEach(function(s){if(cs.indexOf(s.country)<0)cs.push(s.country)});
      cs.sort().forEach(function(c){var o=document.createElement("option");o.textContent=c;$("#sch-country").appendChild(o)});
      draw();
    });
    ["#sch-q","#sch-level","#sch-country"].forEach(function(x){$(x).addEventListener("input",draw)});
  }
})();
