/* ---- WhatsApp ---- */
/* TROQUE pelo número real: 55 + DDD + número, só dígitos (ex.: 5571996306234) */
var WA_NUMBER='5571996306234';
var WA_NAMES=['Landing Pages','Sites Institucionais','E-commerce','Sistemas & Web Apps','Portfólios'];
function waLink(servico){
  return 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent('Olá! Gostaria de solicitar um orçamento'+(servico?' de '+servico:' de site')+'.');
}

(function(){
  /* mobile menu */
  var nav=document.querySelector('.nav'),bg_=document.getElementById('burger');
  bg_.addEventListener('click',function(){var o=nav.classList.toggle('open');bg_.setAttribute('aria-expanded',o?'true':'false')});
  nav.querySelectorAll('ul a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');bg_.setAttribute('aria-expanded','false')})});

  /* marquee */
  var m=document.getElementById('marq'),t='<span>Core Studio</span>';
  m.innerHTML=new Array(24).join(t);
  (function(){var x=0,last=0,half=0,speed=45;
    function measure(){half=m.scrollWidth/2}
    function tick(ts){if(!last)last=ts;var dt=Math.min(64,ts-last)/1000;last=ts;if(!half)measure();
      x=(x+speed*dt)%(half||1);m.style.transform='translate3d('+(-x)+'px,0,0)';requestAnimationFrame(tick)}
    window.addEventListener('resize',measure);window.addEventListener('load',measure);
    requestAnimationFrame(tick)})();

  /* smooth in-page nav (plain anchors can be unreliable in a frame) */
  document.querySelectorAll('[data-go]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href').slice(1),el=id==='top'?document.documentElement:document.getElementById(id);
      if(!el)return;e.preventDefault();
      (id==='top'?window:el).scrollTo?window.scrollTo({top:id==='top'?0:el.getBoundingClientRect().top+window.scrollY,behavior:'smooth'}):0;
    });
  });

  /* video: plays when the section comes into view, freezes on the last frame,
     restarts from the beginning the next time the visitor comes back */
  var v=document.getElementById('vid'),sec=document.getElementById('experiencia'),played=false;
  /* desktop/tablet use the wide video; phones (<=640px) use the portrait one */
  var posterM='assets/image-23.jpg',posterD=v.getAttribute('poster'),
      srcs=[].slice.call(v.querySelectorAll('source')).map(function(x){return{m:x.hasAttribute('data-m'),t:x.type,s:x.src}}),
      mq=window.matchMedia('(max-width:640px)'),curM=null;
  [].slice.call(v.querySelectorAll('source')).forEach(function(x){x.remove()});
  function pickSource(){
    var m=mq.matches;if(m===curM)return;curM=m;
    var pick=null;
    srcs.forEach(function(x){if(pick||x.m!==m)return;var t=x.t.indexOf('mp4')>-1?'video/mp4; codecs="avc1.640028"':'video/webm; codecs="vp9"';if(v.canPlayType(t))pick=x.s});
    if(pick){v.poster=m?posterM:posterD;v.src=pick;v.load()}
  }
  pickSource();
  function start(){
    played=true;sec.classList.remove('done');hideCv();
    try{v.currentTime=0}catch(e){}
    var p=v.play();if(p&&p.catch)p.catch(function(){played=false});
  }
  /* keeps playing while the section is on screen: on each ending the last frame is
     painted on a canvas, the video restarts under it, and the canvas fades out slowly */
  var cv=document.getElementById('vfade'),cx=cv.getContext('2d'),busy=false;
  function hideCv(){cv.style.transition='none';cv.style.opacity='0';busy=false}
  v.addEventListener('ended',function(){
    if(busy)return;busy=true;
    try{cv.width=v.videoWidth||1920;cv.height=v.videoHeight||1080;cx.drawImage(v,0,0,cv.width,cv.height)}catch(e){}
    cv.style.transition='none';cv.style.opacity='1';void cv.offsetWidth;
    v.addEventListener('seeked',function(){
      setTimeout(function(){cv.style.transition='opacity 1.3s ease';cv.style.opacity='0';setTimeout(function(){busy=false},1400)},120);
    },{once:true});
    try{v.currentTime=0}catch(e){}
    var p=v.play();if(p&&p.catch)p.catch(function(){});
  });
  new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.intersectionRatio>=.45&&!played)start();
      else if(en.intersectionRatio<=.12){
        played=false;v.pause();sec.classList.remove('done');hideCv();
        try{v.currentTime=0}catch(e){}
      }
    });
  },{threshold:[0,.05,.12,.2,.45,.6]}).observe(sec);
  document.getElementById('replay').addEventListener('click',start);
  var onMq=function(){curM=null;pickSource();if(played){played=false;start()}};
  if(mq.addEventListener)mq.addEventListener('change',onMq);else if(mq.addListener)mq.addListener(onMq);

  /* services rail with side buttons */
  var rail=document.getElementById('rail'),cards=[].slice.call(rail.querySelectorAll('.svc')),
      prevB=document.getElementById('prev'),nextB=document.getElementById('next'),cnt=document.getElementById('count');
  function padL(){return parseFloat(getComputedStyle(rail).paddingLeft)||0}
  function cur(){
    if(rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4)return cards.length-1;
    var best=0,bd=1e9;cards.forEach(function(c,i){var d=Math.abs(c.offsetLeft-padL()-rail.scrollLeft);if(d<bd){bd=d;best=i}});return best;
  }
  function go(i){i=Math.max(0,Math.min(cards.length-1,i));rail.scrollTo({left:cards[i].offsetLeft-padL(),behavior:'smooth'})}
  var tick=false;
  function upd(){
    tick=false;var i=cur();
    cnt.textContent=('0'+(i+1)).slice(-2)+' / '+('0'+cards.length).slice(-2);
    prevB.disabled=rail.scrollLeft<=2;
    nextB.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4;
  }
  rail.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
  window.addEventListener('resize',upd);
  prevB.addEventListener('click',function(){
    var i=cur(),c=cards[i];
    go(Math.abs(c.offsetLeft-padL()-rail.scrollLeft)>8&&rail.scrollLeft+rail.clientWidth<rail.scrollWidth-4?i:i-1)});
  nextB.addEventListener('click',function(){go(cur()+1)});
  rail.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur()+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(cur()-1)}});
  upd();

  /* plans */
  var plans=[
    {n:'Landing Pages',d:'Entrega em até 10 dias',lead:'Uma página única, pensada para transformar visitas em contatos e vendas.',
     i:['Design exclusivo e 100% responsivo','Texto persuasivo e chamadas para ação','Formulário de contato e botão de WhatsApp','Google Analytics e Meta Pixel integrados','SEO básico e carregamento rápido','Domínio, hospedagem e certificado SSL','Seções sob medida: oferta, provas e perguntas frequentes','Ajustes após a entrega'],bg:['0%','100%','230%']},
    {n:'Sites Institucionais',d:'Entrega em até 15 dias',lead:'O cartão de visitas completo da sua empresa, com tudo organizado para ser encontrado.',
     i:['Até 8 páginas: Home, Sobre, Serviços, Contato e mais','Blog e painel para você editar o conteúdo','SEO técnico e Google Meu Negócio','Galeria, depoimentos e mapa de localização','Formulários, WhatsApp e redes sociais integrados','E-mails profissionais com o seu domínio','Hospedagem, SSL e backups','Treinamento para a sua equipe'],bg:['100%','100%','190%']},
    {n:'E-commerce',d:'Entrega em até 30 dias',lead:'Sua loja virtual pronta para vender, do catálogo ao pós-venda.',
     i:['Catálogo com variações, fotos e estoque','Carrinho e checkout rápido','Pix, cartão e boleto','Frete automático e rastreio de pedidos','Cupons, promoções e recuperação de carrinho','Painel de pedidos, clientes e relatórios','Integração com marketplaces e ERP','Suporte reforçado no lançamento'],bg:['45%','0%','210%']},
    {n:'Sistemas & Web Apps',d:'Entrega em fases, a partir de 45 dias',lead:'Plataformas sob medida para organizar e automatizar a operação do seu negócio.',
     i:['Área logada com perfis e permissões','Painel administrativo sob medida','Dashboards e relatórios em tempo real','Integrações por API com outros sistemas','Banco de dados seguro e backups','Hospedagem escalável e monitoramento'],bg:['70%','40%','250%']},
    {n:'Portfólios',d:'Entrega em até 10 dias',lead:'Um espaço elegante para mostrar o seu trabalho e atrair novos clientes.',
     i:['Galeria de cases com imagens e vídeos','Páginas Sobre, Serviços e Contato','Domínio próprio e visual personalizado','Painel simples para atualizar sozinho','Otimizado para aparecer no Google','Links para redes e botão de contato'],bg:['20%','30%','220%']}
  ];
  var card=document.getElementById('planCard'),nm=document.getElementById('planName'),bg=document.getElementById('stagebg'),th=[].slice.call(document.querySelectorAll('.thumb'));
  function show(k){
    var d=plans[k];nm.textContent=d.n;
    card.innerHTML='<h3>'+d.n+'</h3><p class="lead">'+d.lead+'</p><ul>'+d.i.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul><div class="deadline">'+d.d+'</div>';
    bg.style.setProperty('--bx',d.bg[0]);bg.style.setProperty('--by',d.bg[1]);bg.style.setProperty('--bs',d.bg[2]);
    th.forEach(function(b,j){b.setAttribute('aria-pressed',j===k?'true':'false')});
    var pw=document.getElementById('planWa');if(pw){pw.href=waLink(d.n);pw.target='_blank';pw.rel='noopener'}
    document.getElementById('sitePreview').classList.toggle('show',k===1);document.getElementById('lpPreview').classList.toggle('show',k===0);document.getElementById('ecPreview').classList.toggle('show',k===2);
  }
  th.forEach(function(b){b.addEventListener('click',function(){show(+b.dataset.plan)})});
  /* botões de WhatsApp */
  function wa(a,txt){a.href=waLink(txt);a.target='_blank';a.rel='noopener'}
  document.querySelectorAll('[data-wa]').forEach(function(a){wa(a);if(a.dataset.wa==='plain')a.href='https://wa.me/'+WA_NUMBER});
  document.querySelectorAll('.svc').forEach(function(c){var b=c.querySelector('.book');if(b)wa(b,WA_NAMES[+c.dataset.svc])});
  show(0);
})();

/* ---- service detail pages ---- */
(function(){
  var D=[
   {slug:'landing-pages',n:'Landing Pages',k:'Serviço 01',lead:'Uma página única, pensada com um objetivo claro: transformar visitas em contatos, agendamentos e vendas. Ideal para campanhas, lançamentos, anúncios e negócios que precisam aparecer bem rápido.',meta:['Entrega em até 10 dias','100% responsivo','Pronta para anúncios'],
    inc:[['Design exclusivo','Layout criado do zero para a sua marca, sem templates genéricos, funcionando bem em celular, tablet e computador.'],['Texto que convence','Estrutura de oferta, provas, benefícios e chamadas para ação pensadas para levar a pessoa até o contato.'],['Formulário e WhatsApp','Captação de contatos direto no seu e-mail ou WhatsApp, com botão fixo para falar com você.'],['Analytics e Meta Pixel','Google Analytics e Meta Pixel instalados para você medir cada visita e cada contato gerado.'],['SEO e velocidade','Carregamento rápido e boas práticas de SEO para aparecer melhor e não perder visitantes.'],['Domínio, hospedagem e SSL','Cuidamos da publicação, do endereço e do certificado de segurança. Você só precisa divulgar.']],
    steps:[['Conversa e briefing','Entendemos o seu negócio, o público e o objetivo da página.'],['Design e texto','Você recebe o layout e os textos para aprovar.'],['Desenvolvimento','Construímos, conectamos formulário, WhatsApp e métricas.'],['Publicação','Colocamos no ar e ajustamos o que for preciso após a entrega.']],
    ex:['lp'],
    faq:[['Em quanto tempo fica pronta?','Em até 10 dias após a aprovação do conteúdo e do layout.'],['Posso usar nos meus anúncios?','Sim. A página já sai com Meta Pixel e Google Analytics para você acompanhar os resultados das campanhas.'],['Vocês escrevem os textos?','Sim, criamos o texto persuasivo junto com você, e você aprova antes de ir ao ar.'],['Depois de entregue, posso pedir ajustes?','Sim, estão incluídos ajustes após a entrega.']]},
   {slug:'sites-institucionais',n:'Sites Institucionais',k:'Serviço 02',lead:'O cartão de visitas completo da sua empresa: várias páginas organizadas para apresentar quem você é, o que faz e como ser encontrado e contatado, passando credibilidade desde o primeiro acesso.',meta:['Entrega em até 15 dias','Até 8 páginas','Painel para editar'],
    inc:[['Até 8 páginas','Home, Sobre, Serviços, Contato e as páginas que o seu negócio precisar.'],['Blog e painel de edição','Atualize textos e publique novidades sozinho, sem depender de ninguém.'],['SEO técnico','Estrutura pensada para o Google, além de configuração do Google Meu Negócio.'],['Galeria e depoimentos','Mostre projetos, equipe e clientes satisfeitos para gerar confiança.'],['Mapa e contatos','Localização, formulário, WhatsApp e redes sociais integrados.'],['Identidade da marca','Visual alinhado à sua marca, com performance alta e carregamento rápido.']],
    steps:[['Diagnóstico','Mapeamos o conteúdo e a estrutura de páginas ideal.'],['Design','Criamos o visual e você aprova antes de programar.'],['Desenvolvimento','Montamos o site e o painel de edição.'],['Treinamento e entrega','Mostramos como editar e publicamos com domínio e SSL.']],
    ex:['site'],
    faq:[['Qual a diferença para uma landing page?','A landing page tem um único objetivo e uma página. O site institucional tem várias páginas para apresentar toda a empresa.'],['Consigo editar sozinho?','Sim. Entregamos com um painel simples para editar textos, imagens e o blog.'],['O site aparece no Google?','Sim. Fazemos o SEO técnico e a configuração do Google Meu Negócio.']]},
   {slug:'e-commerce',n:'E-commerce',k:'Serviço 03',lead:'Sua loja virtual pronta para vender, do catálogo ao pós-venda, com pagamento, frete e gestão de pedidos em um só lugar.',meta:['Entrega em até 30 dias','Pix, cartão e boleto','Suporte na virada'],
    inc:[['Catálogo completo','Produtos com variações, fotos, estoque e categorias.'],['Checkout rápido','Carrinho e finalização de compra simples, pensados para converter.'],['Pagamentos','Pix, cartão de crédito e boleto integrados.'],['Frete e rastreio','Cálculo automático de frete e acompanhamento de pedidos.'],['Marketing','Cupons, promoções e recuperação de carrinho abandonado.'],['Painel de gestão','Controle de pedidos, clientes e estoque de forma simples.']],
    steps:[['Planejamento','Definimos catálogo, formas de pagamento e logística.'],['Design da loja','Visual da vitrine e das páginas de produto.'],['Implantação','Cadastro dos produtos e integrações.'],['Lançamento','Suporte de 24h na virada para a loja nascer segura.']],
    ex:[],faq:[['Quais formas de pagamento?','Pix, cartão e boleto, com as integrações que fizerem sentido para a sua operação.'],['Vocês cadastram os produtos?','Podemos cadastrar a carga inicial e ensinar você a gerenciar o restante.'],['E se eu tiver dúvidas após o lançamento?','Damos suporte reforçado no lançamento e na virada.']]},
   {slug:'sistemas-web-apps',n:'Sistemas & Web Apps',k:'Serviço 04',lead:'Plataformas sob medida para organizar e automatizar a operação do seu negócio: do painel administrativo ao relatório em tempo real.',meta:['Entrega em fases','A partir de 45 dias','99,9% de disponibilidade'],
    inc:[['Área logada','Perfis, permissões e acessos para cada tipo de usuário.'],['Painel administrativo','Telas sob medida para a sua rotina de trabalho.'],['Dashboards','Relatórios e indicadores em tempo real.'],['Integrações por API','Conexão com os outros sistemas que você já usa.'],['Banco de dados seguro','Backups e boas práticas de segurança.'],['Evolução contínua','Entregas em fases e melhorias a cada ciclo.']],
    steps:[['Levantamento','Entendemos processos e prioridades.'],['Protótipo','Desenhamos as telas e validamos com você.'],['Desenvolvimento em fases','Entregas parciais para você testar cedo.'],['Implantação e suporte','Publicação, treinamento e acompanhamento.']],
    ex:[],faq:[['Como funciona o orçamento?','Depende do escopo. Fazemos um levantamento e propomos entregas em fases.'],['Posso começar pequeno?','Sim. Começamos pelo essencial e evoluímos por etapas.']]},
   {slug:'portfolios',n:'Portfólios',k:'Serviço 05',lead:'Um espaço elegante para mostrar o seu trabalho e atrair novos clientes, com a sua cara e fácil de atualizar.',meta:['Entrega em até 10 dias','Domínio próprio','Atualize em 5 min'],
    inc:[['Galeria de cases','Imagens e vídeos dos seus melhores trabalhos.'],['Páginas essenciais','Sobre, Serviços e Contato bem organizados.'],['Visual personalizado','Identidade própria e domínio próprio.'],['Painel simples','Atualize projetos sozinho em poucos minutos.'],['Otimizado para o Google','Para você ser encontrado por quem procura o seu trabalho.'],['Rápido no celular','Carregamento leve e bom em qualquer tela.']],
    steps:[['Curadoria','Escolhemos os trabalhos que mais vendem você.'],['Design','Criamos um visual que valoriza o seu estilo.'],['Desenvolvimento','Montamos o site e o painel de atualização.'],['Publicação','Colocamos no ar com domínio e SSL.']],
    ex:[],faq:[['Posso adicionar novos projetos depois?','Sim, pelo painel simples, em poucos minutos.'],['Serve para qualquer profissão?','Sim: fotógrafos, arquitetos, designers, advogados, consultores e outros.']]}
  ];
  var det=document.getElementById('detail'),saved=0,cur=-1;
  var ARR='<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M4 12L12 4M5 4h7v7"/></svg>';
  function esc(s){return s}
  function exFig(t){
    var id={lp:'lpPreview',site:'sitePreview',shop:'shopPreview',app:'appPreview',port:'portPreview'}[t],src=document.getElementById(id);if(!src)return '';
    var cap={lp:'Landing page · Boteco do Tico',site:'Site institucional · Core Empresas',shop:'Loja virtual · Core Store',app:'Sistema · Core Painel',port:'Portfólio · Marina Alves'}[t];
    var f=src.cloneNode(true);f.removeAttribute('id');f.classList.add('show');
    f.querySelector('figcaption').textContent=cap;
    return f.outerHTML;
  }
  function render(i){
    var d=D[i],logo=document.querySelector('footer img');
    var ex=d.ex.length?'<div class="dt-ex">'+d.ex.map(exFig).join('')+'</div>':'<div class="dt-empty"><b>Em breve, os primeiros cases</b>Estamos finalizando os exemplos desta categoria. Quer ver como ficaria para o seu negócio? Peça um orçamento e mostramos uma proposta.</div>';
    det.innerHTML=
     '<div class="dt-bar"><button class="dt-back" type="button" data-back><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 8H3M7 4L3 8l4 4"/></svg>Voltar</button>'+(logo?'<img src="'+logo.src+'" alt="Core">':'')+'</div>'+
     '<section class="dt-hero"><div class="wrap"><span class="dt-kick">'+d.k+'</span><h1><span class="silver">'+d.n+'</span></h1><p class="dt-lead">'+d.lead+'</p><div class="dt-meta">'+d.meta.map(function(x){return'<span>'+x+'</span>'}).join('')+'</div></div></section>'+
     '<section class="dt-sec"><div class="wrap"><h2><small>Incluso</small>O que está incluso</h2><div class="dt-grid">'+d.inc.map(function(x){return'<div class="dt-card"><b>'+x[0]+'</b><p>'+x[1]+'</p></div>'}).join('')+'</div></div></section>'+
     '<section class="dt-sec"><div class="wrap"><h2><small>Processo</small>Como funciona</h2><div class="dt-steps">'+d.steps.map(function(x){return'<div class="dt-step"><b>'+x[0]+'</b><p>'+x[1]+'</p></div>'}).join('')+'</div></div></section>'+
     '<section class="dt-sec"><div class="wrap"><h2><small>Portfólio</small>Exemplos que já fizemos</h2>'+ex+'</div></section>'+
     '<section class="dt-cta"><div class="wrap"><h2>Vamos construir o seu projeto?</h2><a href="'+waLink(d.n)+'" target="_blank" rel="noopener">Solicitar orçamento '+ARR+'</a><div class="dt-other">'+D.map(function(o,j){return j===i?'':'<button type="button" data-svc="'+j+'">'+o.n+'</button>'}).join('')+'</div></div></section>'+
     '<section class="dt-sec"><div class="wrap dt-faq"><h2><small>Dúvidas</small>Perguntas frequentes</h2>'+d.faq.map(function(x){return'<details><summary>'+x[0]+'</summary><p>'+x[1]+'</p></details>'}).join('')+'</div></section>';
  }
  function open(i,noHash){
    if(cur<0)saved=window.scrollY;
    cur=i;render(i);document.body.classList.add('in-detail');window.scrollTo({top:0,behavior:'instant'});
    document.title='Core · '+D[i].n;
    if(!noHash){try{history.replaceState(null,'','#/'+D[i].slug)}catch(e){try{location.hash='/'+D[i].slug}catch(_){}}}
  }
  function close(target){
    cur=-1;document.body.classList.remove('in-detail');det.innerHTML='';document.title='Core Studio';
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
    var el=target&&document.getElementById(target);
    var y=el?el.getBoundingClientRect().top+window.scrollY:saved;
    window.scrollTo({top:y,behavior:'instant'});
  }
  document.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('.svc .book'))return;var b=e.target.closest&&e.target.closest('[data-svc]');if(b){e.preventDefault();open(+b.dataset.svc);return}
    if(e.target.closest&&e.target.closest('[data-back]')){close('servicos');return}
    if(e.target.closest&&e.target.closest('[data-quote]')){e.preventDefault();close('planos')}
  });
  document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('svc')){e.preventDefault();open(+e.target.dataset.svc)}});
  window.addEventListener('hashchange',function(){var m=location.hash.match(/^#\/(.+)$/);if(!m){if(cur>=0)close('servicos');return}
    var i=D.findIndex(function(x){return x.slug===m[1]});if(i>=0&&i!==cur)open(i,true)});
  var m0=location.hash.match(/^#\/(.+)$/);if(m0){var i0=D.findIndex(function(x){return x.slug===m0[1]});if(i0>=0)open(i0,true)}
})();
