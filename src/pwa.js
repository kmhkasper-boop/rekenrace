/* App-modus (PWA): service worker, installatietip en voortgang-brug voor iPad/iPhone. Raakt de spellogica niet. */
(function(){
  var ID='rekenrace', PREFIX='rekenrace_', TIPKEY='pwa_tip_'+ID, CK='pwa_'+ID+'_save';
  var standalone=false;
  try{standalone=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;}catch(e){}
  var ua=navigator.userAgent||'', isIOS=/iPad|iPhone|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1), isAndroid=/Android/i.test(ua);
  var path=location.pathname.replace(/[^\/]*$/,'')||'/';
  /* Voortgang-brug: iOS kopieert bij 'Zet op beginscherm' alleen cookies (geen localStorage) naar de app.
     In de Safari-tab bewaren we daarom een kopie van de opslag in een cookie (alleen voor dit spelpad);
     de app neemt die eenmalig over als hij nog leeg is. Op Android delen tab en app de opslag al. */
  var MAX=3800, DROP=["facts", "daily"];
  function own(){var o={},n=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(PREFIX)===0){try{o[k]=JSON.parse(localStorage.getItem(k));n++;}catch(e){}}}}catch(e){}return n?o:null;}
  function readCookie(){var m=document.cookie.match(new RegExp('(?:^|; )'+CK+'=([^;]*)'));return m?m[1]:null;}
  function setCookie(v,age){try{document.cookie=CK+'='+v+'; Path='+path+'; Max-Age='+age+'; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');}catch(e){}}
  function apply(d){for(var k in d){if(k.indexOf(PREFIX)===0)localStorage.setItem(k,JSON.stringify(d[k]));}}
  function b64(buf){var s='',a=new Uint8Array(buf);for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function unb64(s){var t=atob(s.replace(/-/g,'+').replace(/_/g,'/')),a=new Uint8Array(t.length);for(var i=0;i<t.length;i++)a[i]=t.charCodeAt(i);return a;}
  function z(str){return new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer().then(b64);}
  function unz(s){return new Response(new Blob([unb64(s)]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();}
  function strip(v){var hit=false;if(v&&typeof v==='object'){DROP.forEach(function(p){if(p in v){delete v[p];hit=true;}});if(v.profiles)for(var id in v.profiles){var q=v.profiles[id];DROP.forEach(function(p){if(q&&p in q){delete q[p];hit=true;}});if(q&&q.lv)for(var l in q.lv){if(q.lv[l]&&q.lv[l].ghost){delete q.lv[l].ghost;hit=true;}}}}return hit;}
  function slim(o){var c=JSON.parse(JSON.stringify(o)),hit=false;for(var k in c){if(strip(c[k]))hit=true;}return hit?c:null;}
  function pack(o,json){
    var v='j'+encodeURIComponent(json); if(v.length<=MAX)return Promise.resolve(v);
    var s=slim(o);
    if(typeof CompressionStream==='undefined'){if(!s)return Promise.resolve(null);v='j'+encodeURIComponent(JSON.stringify(s));return Promise.resolve(v.length<=MAX?v:null);}
    return z(json).then(function(c){if(c.length<MAX)return 'z'+c;if(!s)return null;return z(JSON.stringify(s)).then(function(c2){return c2.length<MAX?'z'+c2:null;});});
  }
  try{
    if(standalone){
      var c=readCookie();
      if(c&&!own()){
        if(c.charAt(0)==='j'){apply(JSON.parse(decodeURIComponent(c.slice(1))));setCookie('',0);}
        else if(c.charAt(0)==='z'&&typeof DecompressionStream!=='undefined'&&!sessionStorage.getItem(CK)){
          sessionStorage.setItem(CK,'1');
          unz(c.slice(1)).then(function(t){apply(JSON.parse(t));setCookie('',0);location.reload();}).catch(function(){});
        }
      }else if(c)setCookie('',0);
    }else{
      var last=readCookie(),lastJson=null,busy=false;
      var sync=function(){var o=own();if(!o||busy)return;var json=JSON.stringify(o);if(json===lastJson)return;busy=true;
        pack(o,json).then(function(v){if(v){if(v!==last){setCookie(v,31536000);last=v;}}else if(last){setCookie('',0);last=null;}lastJson=json;})
          .catch(function(){}).then(function(){busy=false;});};
      sync();setInterval(sync,5000);
      addEventListener('pagehide',sync);document.addEventListener('visibilitychange',sync);
    }
  }catch(e){}
  /* Service worker voor offline spelen (relatief pad, scope ./) */
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    addEventListener('load',function(){navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(function(){});});
  }
  /* Installatietip: alleen in een gewone browsertab op iPad/iPhone/Android, nooit in de app zelf */
  if(standalone)return;
  var tip;try{tip=JSON.parse(localStorage.getItem(TIPKEY)||'{}')||{};}catch(e){tip={};}
  function saveTip(){try{localStorage.setItem(TIPKEY,JSON.stringify(tip));}catch(e){}}
  addEventListener('appinstalled',function(){tip.off=1;saveTip();hide();});
  if(tip.off||(tip.n||0)>=3||!(isIOS||isAndroid))return;
  var deferred=null,el=null;
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;var b=el&&el.querySelector('.pwa-tip-go');if(b)b.style.display='';});
  function hide(){if(el){el.remove();el=null;}document.removeEventListener('pointerdown',outside,true);}
  function outside(e){if(el&&!el.contains(e.target))hide();}
  function show(){
    if(el||!document.body)return;
    tip.n=(tip.n||0)+1;saveTip();
    var st=document.createElement('style');
    st.textContent='.pwa-tip{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom));z-index:9999;width:max-content;max-width:min(92vw,520px);display:flex;align-items:center;gap:10px;background:#fff;color:#1f2a44;border-radius:18px;padding:9px 10px 9px 14px;box-shadow:0 4px 0 rgba(31,42,68,.18),0 6px 18px rgba(31,42,68,.18);font:500 15px/1.3 Fredoka,"Baloo 2",Nunito,system-ui,sans-serif;text-align:left;touch-action:manipulation;animation:pwaTipIn .35s ease-out}'+
      '.pwa-tip b{font-weight:700}.pwa-tip small{display:block;font-size:13px;color:#3b4767;margin-top:2px}'+
      '.pwa-tip button{font:inherit;border:none;cursor:pointer;touch-action:manipulation;border-radius:999px}'+
      '.pwa-tip .pwa-tip-go{background:#157a3a;color:#fff;font-weight:700;padding:6px 12px}'+
      '.pwa-tip .pwa-tip-x{background:#eef3f8;color:#1f2a44;width:32px;height:32px;flex:none;font-size:18px;line-height:32px;padding:0}'+
      '@keyframes pwaTipIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}';
    document.head.appendChild(st);
    el=document.createElement('div');el.className='pwa-tip';el.setAttribute('role','note');
    var how=isIOS?'Tik in Safari op <b>Deel</b> (vierkantje met pijl) en kies <b>‘Zet op beginscherm’</b>.':'Tik in Chrome op <b>⋮</b> en kies <b>‘App installeren’</b> of <b>‘Toevoegen aan startscherm’</b>.';
    el.innerHTML='<span aria-hidden="true" style="font-size:22px">📲</span><span><b>Tip:</b> zet dit spel op je beginscherm voor een echte app!<small>'+how+'</small></span>'+
      '<button type="button" class="pwa-tip-go" style="display:'+(deferred?'':'none')+'">Installeren</button><button type="button" class="pwa-tip-x" aria-label="Tip sluiten">✕</button>';
    el.querySelector('.pwa-tip-x').addEventListener('click',function(){tip.off=1;saveTip();hide();});
    el.querySelector('.pwa-tip-go').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(r){if(r&&r.outcome==='accepted'){tip.off=1;saveTip();}}).catch(function(){});deferred=null;hide();});
    document.body.appendChild(el);
    setTimeout(function(){document.addEventListener('pointerdown',outside,true);},0);
  }
  addEventListener('load',function(){setTimeout(show,1500);});
})();
