document.documentElement.classList.add('js');

/* меню */
(function () {
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.classList.toggle('on', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { n.classList.remove('open'); b.classList.remove('on'); }
  });
})();

/* подбор по грузу */
(function () {
  var chips = document.getElementById('chips');
  if (!chips) return;
  var P1 = { name: 'Прицеп №1 · тентованный', dim: 'д. 3,0 · в. 1,60 · ш. 1,40 м', p: ['25 р', '30 р', '35 р'] };
  var P2 = { name: 'Прицеп №2 · тент снимается', dim: 'д. 3,5 · ш. 2,0 · в. 1,7 м', p: ['30 р', '35 р', '40 р'] };
  var LAF = { name: 'Лафет · до 2100 кг', dim: 'д. 4,0 · ш. 1,95 м · категория BE', p: ['—', '—', '80 р'] };
  var DATA = {
    divan:  { w: P2, note: 'Диван 2,2 м влезает в прицеп №2 вдоль борта. Тент лучше снять, чтобы не упираться в дуги.' },
    holod:  { w: P2, note: 'Высокий груз: у прицепа №2 тент снимается, тогда 1,7 м по борту. Перевозите стоя, с фиксацией ремнями.' },
    stir:   { w: P1, note: 'Стиральная машина входит спокойно. Прикрутите барабан или проложите транспортные болты.' },
    doski:  { w: P1, note: 'Доска 3 м ложится по длине прицепа №1 ровно. Свисать не будет.' },
    blok:   { w: P2, note: 'Паллета газоблока — это около тонны: смотрите на разрешённую массу прицепа и на фаркоп автомобиля.' },
    plitka: { w: P1, note: 'До 500 кг прицеп №1 берёт уверенно. Мешки кладите на пол, ближе к оси.' },
    moto:   { w: LAF, note: 'Мотоцикл и квадроцикл удобнее на лафете: лебёдка и площадка под колёса. Нужна категория BE.' },
    auto:   { w: LAF, note: 'Перегон автомобиля на лафете: до 2100 кг, лебёдка затягивает машину без помощника. Категория BE обязательна.' },
    trubi:  { w: LAF, note: 'Трубы 4 м входят только на лафет: у прицепов 3 и 3,5 м длины не хватит.' },
    kult:   { w: P1, note: 'Садовая техника входит с запасом. Зафиксируйте колёса и ручки ремнями.' },
    mebel:  { w: P2, note: 'Офисная мебель: столы и стулья встают в два яруса, если разобрать ножки. Тент защитит от дождя.' }
  };
  var elWhat = document.getElementById('resWhat'),
      elDim = document.getElementById('resDim'),
      elPrice = document.getElementById('resPrice'),
      elNote = document.getElementById('resNote');

  function show(key, btn) {
    var d = DATA[key];
    if (!d) return;
    var list = chips.querySelectorAll('.chip');
    for (var i = 0; i < list.length; i++) list[i].classList.remove('on');
    btn.classList.add('on');
    elWhat.textContent = d.w.name;
    elDim.textContent = d.w.dim;
    elPrice.innerHTML = '<div class="pill"><b>' + d.w.p[0] + '</b><span>3 часа</span></div>' +
      '<div class="pill"><b>' + d.w.p[1] + '</b><span>6 часов</span></div>' +
      '<div class="pill"><b>' + d.w.p[2] + '</b><span>сутки</span></div>';
    elNote.textContent = d.note;
  }
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (b) show(b.getAttribute('data-k'), b);
  });
})();

/* форма заявки */
(function () {
  var f = document.getElementById('reqForm');
  if (!f) return;
  var note = document.getElementById('note');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var item = document.getElementById('q-item').value,
        time = document.getElementById('q-time').value,
        name = document.getElementById('q-name').value.trim(),
        tel = document.getElementById('q-tel').value.trim();
    var bad = false;
    [['q-name', name.length < 2], ['q-tel', tel.replace(/\D/g, '').length < 9]].forEach(function (p) {
      var el = document.getElementById(p[0]);
      el.style.borderColor = p[1] ? '#FF6B6B' : 'var(--line)';
      if (p[1]) bad = true;
    });
    if (bad) { note.textContent = 'Заполните имя и телефон — без них не перезвоним.'; return; }
    var text = 'Заявка на прокат (Абрамук, Дзержинск)\n' +
      'Что нужно: ' + item + '\n' +
      'На сколько: ' + time + '\n' +
      'Имя: ' + name + '\n' +
      'Телефон: ' + tel;
    try { if (navigator.clipboard && navigator.clipboard.writeText) { var pr = navigator.clipboard.writeText(text); if (pr && pr.catch) pr.catch(function () {}); } } catch (err) {}
    note.textContent = 'Заявка готова и скопирована: вставьте её в сообщение или продиктуйте по телефону.';
  });
})();

/* появление блоков */
(function () {
  var els = document.querySelectorAll('.fx');
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
})();
