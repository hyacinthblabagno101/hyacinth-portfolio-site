/* PORTFOLIO CONFIGURATION
   Replace sample cards with actual projects you have permission to publish.
   For Google Drive video: open the file, set appropriate view access,
   copy the file ID from /file/d/FILE_ID/view and add driveId: 'FILE_ID'.
   Do not expose confidential client information or restricted materials. */
const portfolioProjects = [
 {title:'Hair Solution — Promotional Video',category:'Content & video editing',filters:['video','social'],description:'A promotional video candidate from the Hair Solution folder. Film and campaign details can be added once approved for public display.',tags:['Video editing','Beauty'],icon:'▷',style:'rose'},
 {title:'Proper Ecom — Organic Office B-roll',category:'Short-form video',filters:['video'],description:'Organic office b-roll with headline editing, identified in the selected Video Reels folder.',tags:['B-roll','Short-form'],icon:'▶',style:'dark'},
 {title:'Proper Ecom — Ad Creative Variations',category:'Video advertising',filters:['video','social'],description:'Two social video ad exports are available for review in the selected work archive.',tags:['Ads','Editing'],icon:'▷',style:'light'},
 {title:'Hair Solution — Campaign Graphics',category:'Graphic design',filters:['design','social'],description:'Kalilangan promotional campaign graphic and supporting design files identified in the selected designs folder.',tags:['Promotional','Design'],icon:'▦',style:'rose'},
 {title:'iLuxe Aesthetic Center — Graphics',category:'Graphic design',filters:['design'],description:'Three graphic exports ready for creative review and selection.',tags:['Beauty','Design'],icon:'✳',style:'light'},
 {title:'UGC, Creator & AI Work',category:'Additional portfolio categories',filters:['ugc','ai'],description:'Portfolio sections prepared for influencer collaborations and AI-assisted content. Specific examples still need to be shortlisted.',tags:['UGC','AI'],icon:'✦',style:'dark'}
];
// Example video-enabled entry (replace a card above or add a new one):
// {title:'Approved Campaign Reel',category:'Short-form video',filters:['video'],description:'A published campaign reel.',tags:['Editing'],icon:'▷',style:'dark',driveId:'YOUR_GOOGLE_DRIVE_FILE_ID'}
const grid=document.getElementById('project-grid');
function renderProjects(filter='all'){
  const selected=portfolioProjects.filter(p=>filter==='all'||p.filters.includes(filter));
  grid.replaceChildren();
  selected.forEach((p,i)=>{
    const card=document.createElement('article');card.className='project-card';
    const art=document.createElement('div');art.className='project-art';art.dataset.style=p.style||'light';
    const number=document.createElement('span');number.className='art-number';number.textContent=String(i+1).padStart(2,'0');
    const icon=document.createElement('span');icon.className='art-icon';icon.textContent=p.icon||'✳';art.append(number,icon);
    const info=document.createElement('div');info.className='project-info';
    const category=document.createElement('div');category.className='project-category';category.textContent=p.category;
    const title=document.createElement('h3');title.textContent=p.title;
    const desc=document.createElement('p');desc.textContent=p.description;
    const tags=document.createElement('div');tags.className='project-tags';(p.tags||[]).forEach(t=>{const s=document.createElement('span');s.textContent=t;tags.append(s)});
    info.append(category,title,desc,tags);
    if(p.driveId){const button=document.createElement('button');button.className='project-video';button.textContent='Watch project ↗';button.addEventListener('click',()=>openVideo(p.driveId,p.title));info.append(button)}
    card.append(art,info);grid.append(card);
  });
}
renderProjects();
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');renderProjects(button.dataset.filter)}));
const dialog=document.getElementById('video-dialog');
function openVideo(id,title){if(!/^[a-zA-Z0-9_-]+$/.test(id))return;document.getElementById('video-heading').textContent=title;const iframe=document.createElement('iframe');iframe.src=`https://drive.google.com/file/d/${id}/preview`;iframe.title=title;iframe.allow='autoplay; fullscreen';iframe.allowFullscreen=true;document.getElementById('video-frame').replaceChildren(iframe);dialog.showModal()}
function closeVideo(){dialog.close();document.getElementById('video-frame').replaceChildren()}
document.getElementById('close-video').addEventListener('click',closeVideo);dialog.addEventListener('click',e=>{if(e.target===dialog)closeVideo()});dialog.addEventListener('close',()=>document.getElementById('video-frame').replaceChildren());
const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('nav-links');toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();

// Progressive enhancement: content remains visible without IntersectionObserver.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
} else { document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view')); }
