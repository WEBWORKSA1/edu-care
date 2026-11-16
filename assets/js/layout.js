/* Edu.Care — shared header, footer and banners (one source for every page) */
(function(){
  var R=document.documentElement.getAttribute("data-root")||"";
  var here=location.pathname.split("/").pop()||"index.html";
  var nav=[["guides.html","Guides"],["tools.html","Tools"],["scholarships.html","Scholarships"],["videos.html","Videos"],["news.html","News"],["contests.html","Contests"],["careers.html","Careers"],["support.html","Support"]];
  var logo='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#14213d"/><path d="M9 15l11-5 11 5-11 5z" fill="#ffc145"/><path d="M13 18v5c0 2 3.5 4 7 4s7-2 7-4v-5l-7 3.2z" fill="#fff"/><path d="M20 33c-3-2.4-5-4-5-6a2.4 2.4 0 0 1 5-.8 2.4 2.4 0 0 1 5 .8c0 2-2 3.6-5 6z" fill="#ff6b4a"/></svg>';
  var h='<a class="skip" href="#main">Skip to content</a><div class="progress" aria-hidden="true"></div>'+
  '<header class="site-header"><div class="container nav">'+
  '<a class="logo" href="'+R+'index.html" aria-label="Edu.Care home">'+logo+'<span>Edu<b>.</b>Care</span></a>'+
  '<ul class="nav-links" id="nav-links">'+nav.map(function(n){return '<li><a href="'+R+n[0]+'"'+(here===n[0]?' aria-current="page"':'')+'>'+n[1]+'</a></li>'}).join("")+'</ul>'+
  '<div class="nav-actions"><a class="icon-btn" href="'+R+'search.html" aria-label="Search">⌕</a><button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">◐</button>'+
  '<a class="btn btn-primary btn-sm btn-cta" href="'+R+'get-help.html">Free Learning Plan</a>'+
  '<button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">☰</button></div></div></header>';
  var hdr=document.getElementById("hdr"); if(hdr) hdr.outerHTML=h;

  var col=function(t,l){return '<div><h4>'+t+'</h4><ul>'+l.map(function(x){return '<li><a href="'+R+x[0]+'">'+x[1]+'</a></li>'}).join("")+'</ul></div>'};
  var f='<footer class="site-footer"><div class="container"><div class="foot-grid">'+
  '<div><a class="logo" style="color:#fff" href="'+R+'index.html">'+logo+'<span>Edu<b>.</b>Care</span></a><p style="margin-top:14px">Free, practical guidance for students and families — from first lessons to final exams, scholarships and beyond.</p>'+
  '<form class="newsletter" data-form="Newsletter" data-ok="You\'re subscribed. Welcome to Edu.Care!"><label class="sr-only" for="nl-email">Email</label><input id="nl-email" type="email" name="email" placeholder="Your email" required><div class="hp"><input name="_hp" tabindex="-1" autocomplete="off"></div><button class="btn btn-primary btn-sm" type="submit">Subscribe</button><p class="form-msg" role="status"></p></form></div>'+
  col("Learn",[["guides.html","All guides"],["tools.html","Free tools"],["scholarships.html","Scholarship finder"],["videos.html","Video library"],["news.html","Education news"]])+
  col("Get involved",[["get-help.html","Free learning plan"],["support.html","Donate & support"],["contests.html","Contests & prizes"],["careers.html","Careers & talent"],["partner.html","Advertise & partner"]])+
  col("About",[["about.html","About us"],["editorial-policy.html","Editorial policy"],["contact.html","Contact"],["search.html","Search"],["sitemap.xml","Sitemap"]])+
  col("Legal",[["privacy.html","Privacy policy"],["terms.html","Terms of use"],["cookies.html","Cookie policy"],["disclaimer.html","Disclaimer"],["trademark.html","Trademark & copyright"]])+
  '</div><div class="legal"><p>© <span data-year></span> Edu.Care. All rights reserved. Edu.Care is an independent educational resource and is not affiliated with, endorsed by, or connected to any school, government agency, or any organization or trademark owner using the name “Educare” or similar names. See our <a href="'+R+'trademark.html">trademark &amp; copyright disclosure</a>.</p>'+
  '<p>Content is for general information only and is not professional, legal, financial, medical or psychological advice. This site uses cookies and shows ads from Google AdSense.</p></div></div></footer>'+
  '<div class="cookie" role="dialog" aria-label="Cookie notice"><strong>We value your privacy</strong><p style="margin:.4em 0 0">We use cookies to run this site, measure traffic and show ads (including personalized ads from Google). See our <a href="'+R+'cookies.html">cookie policy</a>.</p><div class="btns"><button class="btn btn-primary btn-sm" data-consent="all">Accept all</button><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button></div></div>'+
  '<button class="icon-btn to-top" type="button" aria-label="Back to top">↑</button>';
  var ftr=document.getElementById("ftr"); if(ftr) ftr.outerHTML=f;
})();
