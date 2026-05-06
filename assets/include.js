// Tiny include helper for shared header/footer
async function include(selector, url){
  const el = document.querySelector(selector);
  if(!el) return;
  try{
    const res = await fetch(url);
    el.innerHTML = await res.text();
    // Re-execute any inline scripts inside the injected HTML
    el.querySelectorAll('script').forEach(s=>{
      const n = document.createElement('script');
      if(s.src) n.src = s.src; else n.textContent = s.textContent;
      document.body.appendChild(n);
    });
  }catch(e){console.warn('include failed',url,e)}
}
window.b5Include = async function(headerEl, footerEl, prefix=''){
  await include(headerEl, prefix+'assets/header.html');
  await include(footerEl, prefix+'assets/footer.html');
  // Fix relative links when running from /pages/*
  if(prefix==='../'){
    document.querySelectorAll('[data-menu] a, .quote-cta, .b5-footer a, .b5-header .logo').forEach(a=>{
      const href = a.getAttribute('href');
      if(!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('../')) return;
      if(href === 'index.html') a.setAttribute('href','../index.html');
      else if(href.startsWith('pages/')) a.setAttribute('href','../'+href.replace('pages/',''));
    });
    // Fix logo
    const logo = document.querySelector('.b5-header .logo');
    if(logo) logo.setAttribute('href','../index.html');
  }
}
