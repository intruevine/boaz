// Admin Holiday Management
function renderHolidaysManagement() {
  const container = document.getElementById('adminHolidaysTab');
  const currentYear = new Date().getFullYear();
  const nationalHolidays = KOREAN_HOLIDAYS[currentYear] || [];

  container.innerHTML = `
    <h4 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">공휴일 관리</h4>
    
    <div class="mb-6">
      <h5 class="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">${currentYear}년 공휴일 목록</h5>
      <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 max-h-60 overflow-y-auto">
        ${nationalHolidays
          .map(
            (h) => `
          <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700 last:border-0">
            <div>
              <span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${h.type === 'national' ? '#dc2626' : '#f59e0b'}"></span>
              <span class="font-medium">${h.name}</span>
              <span class="text-sm text-gray-500 ml-2">${h.date}</span>
            </div>
            <span class="text-xs px-2 py-1 rounded" style="background-color: ${h.type === 'national' ? '#fecaca' : '#fde68a'}; color: ${h.type === 'national' ? '#991b1b' : '#92400e'}">
              ${h.type === 'national' ? '국가공휴일' : '기업휴일'}
            </span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    
    <div class="mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
      <h5 class="text-md font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <i class="fas fa-calendar-plus text-luxury-gold-500 mr-2"></i>
        추가 공휴일 등록
      </h5>
      <div class="space-y-4">
        <div>
          <label for="customHolidayDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <i class="far fa-calendar-alt mr-1.5 text-luxury-navy-500 dark:text-luxury-gold-400"></i>날짜
          </label>
          <input type="date" id="customHolidayDate" class="form-input block w-full px-4 py-2.5 bg-white dark:bg-slate-800">
        </div>
        <div>
          <label for="customHolidayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <i class="fas fa-tag mr-1.5 text-luxury-navy-500 dark:text-luxury-gold-400"></i>공휴일 이름
          </label>
          <input type="text" id="customHolidayName" placeholder="예: 창립기념일" class="form-input block w-full px-4 py-2.5 bg-white dark:bg-slate-800">
        </div>
        <div>
          <label for="customHolidayType" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            <i class="fas fa-layer-group mr-1.5 text-luxury-navy-500 dark:text-luxury-gold-400"></i>
            <span class="text-gray-700 dark:text-gray-200">유형</span>
          </label>
          <select id="customHolidayType" class="form-select block w-full px-4 py-2.5 bg-white dark:bg-slate-800">
            <option value="company">🏢 기업휴일</option>
            <option value="national">🇰🇷 국가공휴일</option>
          </select>
        </div>
        <button id="addCustomHolidayButton" class="w-full mt-2 bg-gradient-to-r from-luxury-navy-700 to-luxury-navy-800 hover:from-luxury-navy-800 hover:to-luxury-navy-900 text-white font-semibold py-3 px-4 rounded-xl interactive-button shadow-md border border-luxury-gold-500/20 transition-all duration-300">
          <i class="fas fa-plus-circle mr-2"></i> 공휴일 등록하기
        </button>
      </div>
    </div>
    
    <div>
      <h5 class="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">등록된 추가 공휴일</h5>
      <div id="customHolidaysList" class="space-y-2">
        ${customHolidays.length === 0 ? '<p class="text-gray-500 text-sm">등록된 추가 공휴일이 없습니다.</p>' : ''}
        ${customHolidays
          .map(
            (h) => `
          <div class="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-lg" data-date="${h.date}">
            <div>
              <span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${h.type === 'national' ? '#dc2626' : '#f59e0b'}"></span>
              <span class="font-medium">${h.name}</span>
              <span class="text-sm text-gray-500 ml-2">${h.date}</span>
            </div>
            <button class="delete-custom-holiday text-red-500 hover:text-red-700 p-1" data-date="${h.date}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    
    <div class="mt-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
      <p class="text-sm text-blue-800 dark:text-blue-300">
        <i class="fas fa-info-circle mr-2"></i>
        공휴일은 달력에 표시되며, 지원 일정 계획 시 참고할 수 있습니다.
        국가공휴일은 빨간색으로, 기업휴일은 주황색으로 표시됩니다.
      </p>
    </div>
  `;

  // Add custom holiday
  container.querySelector('#addCustomHolidayButton').addEventListener('click', () => {
    const date = container.querySelector('#customHolidayDate').value;
    const name = container.querySelector('#customHolidayName').value.trim();
    const type = container.querySelector('#customHolidayType').value;

    if (!date || !name) {
      showToast('error', '날짜와 이름을 모두 입력해주세요.');
      return;
    }

    if (customHolidays.some((h) => h.date === date)) {
      showToast('error', '이미 등록된 날짜입니다.');
      return;
    }

    addCustomHoliday(date, name, type);
    showToast('success', '공휴일이 등록되었습니다.');
    renderHolidaysManagement();

    if (calendar) {
      updateCalendarEvents();
    }
  });

  // Delete custom holiday
  container.querySelectorAll('.delete-custom-holiday').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const date = e.currentTarget.dataset.date;
      removeCustomHoliday(date);
      showToast('success', '공휴일이 삭제되었습니다.');
      renderHolidaysManagement();

      if (calendar) {
        updateCalendarEvents();
      }
    });
  });
}
