/* =========================================================
  كراج الميكانيك — مدينة العهد
   ملف البرمجة المشترك بين كل الصفحات
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFieldGenerator();
  initViolationsPage();
  initReportsPage();
});

/* ---------------------------------------------------------
   1) قائمة التنقل (زر الجوال + القائمة المنسدلة "الجداول")
--------------------------------------------------------- */
function initNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const dropTrigger = document.querySelector('.nav-drop > button');
  const drop = document.querySelector('.nav-drop');

  if (toggle && header) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });
  }

  if (dropTrigger && drop) {
    dropTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      drop.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!drop.contains(e.target)) drop.classList.remove('open');
    });
  }
}

/* ---------------------------------------------------------
   2) مولّد المسمى الميداني
   يبني نص مسمى بالتنسيق: الاسم | التوجيه | G-XXX
   عدّل دالة buildCallsign() حسب التنسيق الرسمي المعتمد عندكم.
--------------------------------------------------------- */
function initFieldGenerator() {
  const form = document.getElementById('callsign-form');
  if (!form) return;

  const nameInput = document.getElementById('callsign-name');
  const directionInput = document.getElementById('callsign-direction');
  const codeInput = document.getElementById('callsign-code');
  const resultBox = document.getElementById('callsign-result');
  const resultText = document.getElementById('callsign-result-text');
  const copyBtn = document.getElementById('callsign-copy');

  function buildCallsign() {
    const name = nameInput.value.trim();
    const direction = directionInput.value.trim();
    const codeRaw = codeInput.value.trim();

    if (!name || !direction || !codeRaw) {
      return null;
    }

    const code = codeRaw.padStart(3, '0');
    return `${name} | ${direction} | G-${code}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const callsign = buildCallsign();

    if (!callsign) {
      nameInput.reportValidity();
      return;
    }

    resultText.textContent = callsign;
    resultBox.classList.add('show');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = resultText.textContent;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'تم النسخ ✔';
        setTimeout(() => { copyBtn.innerHTML = '📋 نسخ المسمى'; }, 1500);
      } catch (err) {
        alert('تعذر نسخ المسمى، انسخه يدويًا: ' + text);
      }
    });
  }
}

/* ---------------------------------------------------------
   3) صفحة المخالفات: بحث + تصفية حسب الفئة
--------------------------------------------------------- */
function initViolationsPage() {
  const list = document.getElementById('violations-list');
  if (!list) return;

  const searchInput = document.getElementById('violation-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = Array.from(list.querySelectorAll('.violation-card'));
  const categoryHeadings = Array.from(list.querySelectorAll('.category-heading'));
  const emptyState = document.getElementById('violations-empty');

  let activeCategory = 'الكل';

  function applyFilters() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = activeCategory === 'الكل' || card.dataset.category === activeCategory;
      const text = card.textContent.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const show = matchesCategory && matchesQuery;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // إظهار/إخفاء عناوين الفئات حسب وجود بطاقات ظاهرة تحتها
    categoryHeadings.forEach((heading) => {
      const cat = heading.dataset.category;
      const anyVisible = cards.some(
        (c) => c.dataset.category === cat && c.style.display !== 'none'
      );
      heading.style.display = anyVisible ? '' : 'none';
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  applyFilters();
}

/* ---------------------------------------------------------
   4) صفحة التقارير الإدارية
--------------------------------------------------------- */
function initReportsPage() {
  const gate = document.getElementById('reports-gate');
  const app = document.getElementById('reports-app');
  if (!gate || !app) return;

  const passwordForm = document.getElementById('reports-password-form');
  const passwordInput = document.getElementById('reports-password');
  const passwordError = document.getElementById('reports-password-error');
  const tabs = document.getElementById('report-tabs');
  const panels = document.getElementById('report-panels');
  const days = ['اختر اليوم', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const levels = ['فني متدرب', ...Array.from({ length: 10 }, (_, index) => `مستوى ${index + 1}`)];

  const user = (label, id) => ({ label, id, type: 'user' });
  const code = (label, id) => ({ label, id, type: 'code' });
  const text = (label, id, type = 'text') => ({ label, id, type });
  const time = (label, id) => ({ label, id, type: 'time' });
  const date = (label, id) => ({ label, id, type: 'date' });
  const day = (label = 'اليوم', id = 'day') => ({ label, id, type: 'day' });
  const yesNo = (label, id) => ({ label, id, type: 'yesno' });
  const many = (factory, labels, prefix) => labels.map((label, index) => factory(label, `${prefix}${index + 1}`));

  const commonHeader = [text('رقم التقرير', 'reportNumber', 'number'), day(), time('الساعة', 'reportTime'), date('التاريخ', 'reportDate')];
  const reports = [
    {
      id: 'deputy', title: 'تقارير نائب الموجه', icon: '📋', fields: [
        ...commonHeader, text('مستشار عام', 'generalAdvisor', 'user'), text('المشرف العام', 'generalSupervisor', 'user'),
        text('مشرفين المناطق', 'areaSupervisors', 'user'), text('الموجه الميداني', 'fieldGuide', 'user'),
        text('نائب الموجه', 'deputyGuide', 'user'), text('مركز الاتصالات', 'dispatch', 'user'),
        ...['لوس', 'ساندي', 'بوليتو', 'فني ميناء', 'اسطول لوس', 'اسطول بوليتو', 'تسجيل خروج'].map((label, index) => code(label, `certified${index}`))
      ], heading: 'تقرير نائب الموجه اليومي'
    },
    {
      id: 'area', title: 'تقارير إشراف منطقة', icon: '🗺️', fields: [
        text('رقم التقرير', 'areaReportNumber', 'number'), text('اسم المنطقة', 'areaName'), time('من الساعة', 'areaFrom'), time('إلى الساعة', 'areaTo'),
        text('المشرف', 'areaSupervisor', 'user'), text('اسم المشرف', 'areaSupervisorName'), text('الموجه الميداني', 'areaFieldGuide', 'user'),
        text('نائب الموجه', 'areaDeputy', 'user'), text('مركز الاتصالات', 'areaDispatch', 'user'),
        ...['ملاحظات إيجابية', 'ملاحظات الموجه الميداني', 'ملاحظات نائب الموجه', 'ملاحظات مركز الاتصالات', 'ملاحظات سلبية'].map((label, index) => text(label, `areaNote${index}`, 'textarea'))
      ], heading: 'تقرير إشراف منطقة'
    },
    {
      id: 'supply', title: 'تقرير التعديل والتزويد', icon: '🔧', fields: [day('اليوم', 'supplyDay'), date('التاريخ', 'supplyDate'), time('الساعة', 'supplyTime'),
        text('التقرير من', 'supplyReporter', 'user'), text('مسؤول التعديل والتزويد', 'supplyManager', 'user'), text('إدارة الكراج', 'supplyAdmin', 'user'),
        ...many(user, Array.from({ length: 10 }, (_, i) => `مسار ${i + 1}`), 'route'),
        ...many(user, ['مسار شاحنات 1', 'مسار شاحنات 2'], 'truckRoute'),
        ...many(user, Array.from({ length: 4 }, (_, i) => `تنظيم سير ${i + 1}`), 'traffic'),
        text('وحدات الدعم في القطاعات الأخرى', 'supportUnits', 'textarea')], heading: 'تقرير التعديل والتزويد'
    },
    {
      id: 'decisions', title: 'القرارات الإدارية', icon: '⚖️', subTabs: [
        { id: 'internalLeave', title: 'إجازة داخلية', fields: [user('الفني', 'internalUser'), text('المدة بالساعات', 'internalDuration', 'number'), time('من الساعة', 'internalFrom'), time('إلى الساعة', 'internalTo'), text('الرصيد المتبقي بالساعات', 'internalBalance', 'number')] },
        { id: 'externalLeave', title: 'إجازة خارجية', fields: [user('الفني', 'externalUser'), text('المدة بالأيام', 'externalDuration', 'number'), date('من تاريخ', 'externalFrom'), date('إلى تاريخ', 'externalTo')] },
        { id: 'extendLeave', title: 'تمديد إجازة', fields: [user('الفني', 'extendUser'), text('مدة التمديد بالأيام', 'extendDuration', 'number'), date('إلى تاريخ', 'extendTo')] },
        { id: 'cancelLeave', title: 'قطع إجازة', fields: [user('الفني', 'cancelUser')] },
        { id: 'resignation', title: 'استقالة', fields: [user('الفني', 'resignUser'), text('السبب', 'resignReason', 'textarea'), { label: 'المستوى السابق', id: 'resignLevel', type: 'level' }, text('الاسم الكامل', 'resignName'), text('الكود الميداني', 'resignCode', 'code'), yesNo('هل يوجد مخالفات سابقة؟', 'resignViolations'), yesNo('هل تم سحبها؟', 'resignWithdrawn')] },
        { id: 'dismissal', title: 'فصل من الخدمة', fields: [user('الفني', 'dismissUser'), { label: 'المستوى السابق', id: 'dismissLevel', type: 'level' }, text('الاسم الكامل', 'dismissName'), text('الكود الميداني', 'dismissCode', 'code'), yesNo('هل يوجد مخالفات سابقة؟', 'dismissViolations'), yesNo('هل تم سحبها؟', 'dismissWithdrawn'), text('العقوبة الإجمالية', 'dismissPenalty', 'textarea'), text('سبب الفصل', 'dismissReason', 'textarea')] }
      ]
    },
  ];

  const formatValue = (field, value) => {
    const clean = (value || '').trim();
    if (!clean) return '-';
    if (field.type === 'user') return `#${clean.replace(/\D/g, '') || '-'}`;
    if (field.type === 'code') return /^G-/i.test(clean) ? clean : `G-${clean.padStart(3, '0')}`;
    return clean;
  };

  const inputMarkup = (field) => {
    if (field.type === 'day') return `<label>${field.label}<select name="${field.id}">${days.map(value => `<option>${value}</option>`).join('')}</select></label>`;
    if (field.type === 'level') return `<label>${field.label}<select name="${field.id}">${levels.map(value => `<option>${value}</option>`).join('')}</select></label>`;
    if (field.type === 'yesno') return `<fieldset class="yesno-field"><legend>${field.label}</legend><label><input type="radio" name="${field.id}" value="نعم"> نعم</label><label><input type="radio" name="${field.id}" value="لا" checked> لا</label></fieldset>`;
    if (field.type === 'textarea') return `<label class="full-field">${field.label}<textarea name="${field.id}" rows="3"></textarea></label>`;
    if (field.type === 'time') return `<label>${field.label}<span class="time-field"><input class="time-input" type="text" name="${field.id}" placeholder="00:00"><span class="period-toggle"><label><input type="radio" name="${field.id}Period" value="ص" checked> ص</label><label><input type="radio" name="${field.id}Period" value="م"> م</label></span></span></label>`;
    const type = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : field.type === 'time' ? 'text' : 'text';
    const placeholder = field.type === 'code' ? 'أدخل الكود فقط (مثال: G-000)' : field.type === 'user' ? 'User ID' : '';
    return `<label>${field.label}<input type="${type}" name="${field.id}" placeholder="${placeholder}" ${field.type === 'user' ? 'inputmode="numeric"' : ''}></label>`;
  };

  const reportText = (definition, form) => {
    const values = Object.fromEntries(new FormData(form).entries());
    if (definition.id === 'area') {
      const value = id => (values[id] || '').trim() || '-';
      const mention = id => {
        const userId = (values[id] || '').replace(/\D/g, '');
        return userId ? `<@${userId}>` : '-';
      };
      const areaTime = id => `${value(id)} ${values[`${id}Period`] || 'ص'}`;
      const note = id => value(id) === '-' ? 'لايوجد' : value(id);
      return [
        `**\`تقرير (${value('areaReportNumber')})\`**`,
        '',
        `تم استلام مشرف منطقة ${value('areaName')} من الساعة ${areaTime('areaFrom')} إلى الساعة ${areaTime('areaTo')}`,
        '',
        `المشرف : ${mention('areaSupervisor')}`,
        `الاسم : ${value('areaSupervisorName')}`,
        `الموجه الميداني : ${mention('areaFieldGuide')}`,
        `نائب الموجه : ${mention('areaDeputy')}`,
        `مركز الاتصالات : ${mention('areaDispatch')}`,
        '',
        `ملاحظات ايجابية : ${note('areaNote0')}`,
        `الموجه الميداني : ${note('areaNote1')}`,
        `نائب الموجه : ${note('areaNote2')}`,
        `مركز الاتصالات : ${note('areaNote3')}`,
        `ملاحظات سلبية : ${note('areaNote4')}`
      ].join('\n');
    }
    const lines = [`${definition.heading || definition.title}`];
    definition.fields.forEach(field => {
      if (field.type === 'yesno') lines.push(`${field.label}: ${values[field.id] || 'لا'}`);
      else if (field.type === 'time') lines.push(`${field.label}: ${formatValue(field, values[field.id])} ${values[`${field.id}Period`] || 'ص'}`);
      else if (field.type !== 'textarea' || values[field.id]?.trim()) lines.push(`${field.label}: ${formatValue(field, values[field.id])}`);
    });
    return lines.join('\n');
  };

  const copyReport = async (textValue, button) => {
    try { await navigator.clipboard.writeText(textValue); button.textContent = 'تم النسخ ✔'; setTimeout(() => { button.textContent = '📋 نسخ التقرير'; }, 1500); }
    catch (error) { alert(`تعذر النسخ، انسخ النص يدويًا:\n${textValue}`); }
  };

  const renderForm = (definition) => {
    const fields = definition.fields.map(inputMarkup).join('');
    return `<form class="reports-form report-form" data-report-id="${definition.id}"><div class="report-fields">${fields}</div><div class="report-actions"><button class="btn-primary" type="submit">📝 إنشاء التقرير</button><button class="btn-secondary copy-report" type="button" disabled>📋 نسخ التقرير</button></div><pre class="report-result" hidden></pre></form>`;
  };

  const renderReports = () => {
    tabs.innerHTML = reports.map((report, index) => `<button class="report-tab${index === 0 ? ' active' : ''}" role="tab" aria-selected="${index === 0}" data-report="${report.id}">${report.icon} ${report.title}</button>`).join('');
    panels.innerHTML = reports.map((report, index) => `<section class="report-panel${index === 0 ? ' active' : ''}" data-panel="${report.id}">${report.id === 'decisions' ? `<div class="sub-tabs">${report.subTabs.map((sub, subIndex) => `<button class="sub-tab${subIndex === 0 ? ' active' : ''}" data-sub="${sub.id}">${sub.title}</button>`).join('')}</div>${report.subTabs.map((sub, subIndex) => `<div class="sub-panel${subIndex === 0 ? ' active' : ''}" data-sub-panel="${sub.id}"><h2>${sub.title}</h2>${renderForm({ ...sub, heading: `نموذج ${sub.title}` })}</div>`).join('')}` : `<h2>${report.title}</h2>${renderForm(report)}</section>`}`).join('');
    bindReportEvents();
  };

  const bindReportEvents = () => {
    tabs.querySelectorAll('.report-tab').forEach(tab => tab.addEventListener('click', () => {
      tabs.querySelectorAll('.report-tab').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });
      panels.querySelectorAll('.report-panel').forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.querySelector(`[data-panel="${tab.dataset.report}"]`).classList.add('active');
    }));
    panels.querySelectorAll('.sub-tab').forEach(tab => tab.addEventListener('click', () => {
      const parent = tab.closest('.report-panel');
      parent.querySelectorAll('.sub-tab, .sub-panel').forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      parent.querySelector(`[data-sub-panel="${tab.dataset.sub}"]`).classList.add('active');
    }));
    panels.querySelectorAll('input[type="text"][inputmode="numeric"]:not(.time-input)').forEach(input => input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, ''); }));
    panels.querySelectorAll('input[name$="Code"], input[placeholder^="أدخل الكود"]').forEach(input => input.addEventListener('blur', () => { if (/^\d+$/.test(input.value.trim())) input.value = `G-${input.value.trim().padStart(3, '0')}`; }));
    panels.querySelectorAll('.report-form').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      const definition = reports.flatMap(item => item.id === 'decisions' ? item.subTabs : [item]).find(item => item.id === form.dataset.reportId);
      const result = form.querySelector('.report-result');
      const copy = form.querySelector('.copy-report');
      result.textContent = reportText(definition, form);
      result.hidden = false;
      copy.disabled = false;
      copy.onclick = () => copyReport(result.textContent, copy);
    }));
  };

  passwordForm.addEventListener('submit', event => {
    event.preventDefault();
    if (passwordInput.value === '1234') { gate.hidden = true; app.hidden = false; renderReports(); }
    else { passwordError.classList.add('show'); passwordInput.select(); }
  });
}
