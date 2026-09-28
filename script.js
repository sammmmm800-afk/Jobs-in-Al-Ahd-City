// Disable right-click, copying, and selecting
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

// Tab switching
const tabs = document.querySelectorAll('.report-tab');
const panels = document.querySelectorAll('.report-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}Panel`).classList.add('active');
  });
});

// Mobile menu
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Name Generator
function generateName() {
  const code = document.getElementById('nameGenCode').value.trim();
  const position = document.getElementById('nameGenPosition').value.trim();

  if (!code) {
    showToast('يرجى إدخال رقم الكود');
    return;
  }
  if (!position) {
    showToast('يرجى إدخال التوجيه');
    return;
  }

  const fullName = `P-${code} | ${position}`;
  document.getElementById('nameGenOutput').value = fullName;
  document.getElementById('nameGenResult').classList.add('show');
  document.getElementById('nameGenResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyGeneratedName() {
  const output = document.getElementById('nameGenOutput');
  const text = output.value.trim();
  const copyBtn = document.getElementById('nameGenCopyBtn');

  if (!text) {
    showToast('لا يوجد اسم لنسخه');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.classList.add('copied');
    showToast('تم نسخ الاسم بنجاح!');
    setTimeout(() => copyBtn.classList.remove('copied'), 2000);
  });
}

// Format Discord mention
function formatDiscord(value) {
  if (!value) return '';
  const id = value.trim();
  return id ? `<@${id}>` : '';
}

// Format codes
function formatCodes(value) {
  if (!value) return 'P-000';
  return value.split(/[\n,]/).map(c => c.trim()).filter(c => c).join('\n') || 'P-000';
}

// Generate Los Santos Report
function generateLosReport() {
  const startTime = document.getElementById('losStartTime').value || '';
  const endTime = document.getElementById('losEndTime').value || '';
  
  let report = `تم استلام مهام العمليات لمنطقة لوس في تمام الساعة ${startTime} إلى ${endTime}\n`;
  report += `العمليات : ${formatDiscord(document.getElementById('losOperations').value)}\n\n`;
  report += `نائب العمليات : ${formatDiscord(document.getElementById('losOperationsDeputy').value)}\n\n`;
  report += `الـقـيـادات : ${formatCodes(document.getElementById('losLeaders').value)}\n\n`;
  report += `الـضـبـاط : ${formatCodes(document.getElementById('losOfficers').value)}\n\n`;
  report += `—————————————————\n\n`;
  report += `الـدورات الـمـفـعـلـة :\n${document.getElementById('losCourses').value || 'لا يوجد'}\n\n`;
  report += `—————————————————\n\n`;
  report += `الـشـرطـة الـعـسـكـريـة :\n${formatCodes(document.getElementById('losMilitary').value)}\n`;
  report += `—————————————————\n\n`;
  report += `جيم 1 :\n${formatCodes(document.getElementById('losJim1').value)}\n\n`;
  report += `—————————————————\n\n`;
  report += `جيم 2 :\n${formatCodes(document.getElementById('losJim2').value)}\n`;
  report += `—————————————————\n\n`;
  report += `جيم 3 :\n${formatCodes(document.getElementById('losJim3').value)}\n`;
  report += `—————————————————\n\n`;
  report += `جيم 4 :\n${formatCodes(document.getElementById('losJim4').value)}\n`;
  report += `—————————————————\n\n`;
  report += `جيم 5 :\n${formatCodes(document.getElementById('losJim5').value)}\n`;
  report += `—————————————————\n\n`;
  report += `الـوحـدات الـمـشـتـركـة :\n${document.getElementById('losShared').value || ''}\n\n`;
  report += `—————————————————\n\n`;
  report += `تـسـجـيـل الـخـروج :\n${document.getElementById('losLogout').value || ''}`;

  document.getElementById('losOutput').value = report;
  document.getElementById('losResult').classList.add('show');
  document.getElementById('losResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Generate Sandy Report
function generateSandyReport() {
  const startTime = document.getElementById('sandyStartTime').value || '';
  const endTime = document.getElementById('sandyEndTime').value || '';
  
  let report = `تم استلام مهام العمليات لمنطقة ساندي وبوليتو في تمام الساعة ${startTime} إلى ${endTime}\n\n`;
  report += `الــعمــلـيـات : ${formatDiscord(document.getElementById('sandyOperations').value)}\n\n`;
  report += `نــائـــب الــعمــلـيـات : ${formatDiscord(document.getElementById('sandyOperationsDeputy').value)}\n`;
  report += `—————————————————\n\n`;
  report += `الـقـيـادات :\n${formatCodes(document.getElementById('sandyLeaders').value)}\n`;
  report += `—————————————————\n\n`;
  report += `الـضـبـاط :\n${formatCodes(document.getElementById('sandyOfficers').value)}\n`;
  report += `—————————————————\n\n`;
  report += `الـدورات الـمـفـعـلـة :\n${document.getElementById('sandyCourses').value || 'لا يوجد'}\n\n`;
  report += `—————————————————\n\n`;
  report += `الـشـرطـة الـعـسـكـريـة :\n${formatCodes(document.getElementById('sandyMilitary').value)}\n\n`;
  report += `—————————————————\n\n`;
  report += `سـيـن 1 :\n${formatCodes(document.getElementById('sandySin1').value)}\n`;
  report += `—————————————————\n\n`;
  report += `سـيـن 2 :\n${formatCodes(document.getElementById('sandySin2').value)}\n`;
  report += `—————————————————\n\n`;
  report += `بـاء 1 :\n${formatCodes(document.getElementById('sandyBa1').value)}\n`;
  report += `—————————————————\n\n`;
  report += `الـوحـدات الـمـشـتـركـة :\n${document.getElementById('sandyShared').value || ''}\n\n`;
  report += `—————————————————\n\n`;
  report += `تـسـجـيـل الـخـروج :\n${document.getElementById('sandyLogout').value || ''}`;

  document.getElementById('sandyOutput').value = report;
  document.getElementById('sandyResult').classList.add('show');
  document.getElementById('sandyResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Generate Officer Report
function generateOfficerReport() {
  const taskNum = document.getElementById('officerTaskNum').value || '1';
  const area = document.getElementById('officerArea').value;
  const startTime = document.getElementById('officerStartTime').value || '';
  const endTime = document.getElementById('officerEndTime').value || '';
  
  let report = `تم استلام مهام ( ${taskNum} ) المنطقة "${area}" في تمام الساعة ${startTime} الى ${endTime}\n\n`;
  report += `الجهات الأمنية المتواجدة :\n${document.getElementById('officerSecurity').value || ''}\n\n`;
  report += `ملاحظة ايجابيه :\n${document.getElementById('officerPositive').value || ''}\n\n`;
  report += `ملاحظة سلبية :\n${document.getElementById('officerNegative').value || ''}\n\n`;
  report += `تقرير العمليات : ${document.getElementById('officerReportLink').value || ''}\n\n`;
  report += `تم رفع التقرير من قبل الضابط : ${formatDiscord(document.getElementById('officerDiscord').value)}`;

  document.getElementById('officerOutput').value = report;
  document.getElementById('officerResult').classList.add('show');
  document.getElementById('officerResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Generate Area Officer Report
function generateAreaReport() {
  const taskNum = document.getElementById('areaTaskNum').value || '';
  const region = document.getElementById('areaRegion').value;
  const startTime = document.getElementById('areaStartTime').value || '';
  const endTime = document.getElementById('areaEndTime').value || '';
  const shift = document.getElementById('areaShift').value;
  
  let report = `تم استلام مهام ( ${taskNum} ) في منطقة (${region}) في تمام الساعة (${startTime}) م الى (${endTime}) م وقت استلام الشفت (${shift})\n\n`;
  report += `الوحدات التابعه للمنطقه :\n${document.getElementById('areaUnits').value || ''}\n\n`;
  report += `عدد الوحدات عند استلام مهام ضابط منطقة : ${document.getElementById('areaUnitsStart').value || ''}\n\n`;
  report += `الايجابيات للوحدات التابعة للمنطقة :\n${document.getElementById('areaPositives').value || ''}\n\n`;
  report += `السلبيات للوحدات التابعة للمنطقة :\n${document.getElementById('areaNegatives').value || ''}\n\n`;
  report += `عدد الوحدات عند انتهاء استلام مهام ضابط منطقة : ${document.getElementById('areaUnitsEnd').value || ''}\n\n`;
  report += `تم رفع التقرير من قبل رئيس رقباء : ${formatDiscord(document.getElementById('areaChief').value)}`;

  document.getElementById('areaOutput').value = report;
  document.getElementById('areaResult').classList.add('show');
  document.getElementById('areaResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy report
function copyReport(outputId) {
  const output = document.getElementById(outputId);
  const text = output.value.trim();

  if (!text) {
    showToast('لا يوجد تقرير لنسخه');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('تم نسخ التقرير بنجاح!');
  });
}

// Lightbox
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const cursorStarQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastCursorStarX = -Infinity;
let lastCursorStarY = -Infinity;
let activeCursorStars = 0;

if (cursorStarQuery.matches && !reducedMotionQuery.matches) {
  document.addEventListener('pointermove', (event) => {
    if (activeCursorStars >= 24 || Math.hypot(event.clientX - lastCursorStarX, event.clientY - lastCursorStarY) < 18) return;

    lastCursorStarX = event.clientX;
    lastCursorStarY = event.clientY;

    const star = document.createElement('span');
    star.className = 'cursor-star';
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;
    star.style.setProperty('--star-size', `${5 + Math.random() * 6}px`);
    star.style.setProperty('--star-angle', `${Math.random() * 90}deg`);
    star.style.setProperty('--star-color', Math.random() < 0.25 ? 'var(--gold)' : 'var(--accent-light)');
    document.body.append(star);
    activeCursorStars++;

    window.setTimeout(() => {
      star.remove();
      activeCursorStars--;
    }, 720);
  }, { passive: true });
}

