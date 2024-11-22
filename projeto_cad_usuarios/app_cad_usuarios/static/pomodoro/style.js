document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.querySelector('.days');
    const totalDays = 35; // 5 weeks
    const activeDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const selectedDay = 10;

    for (let i = 1; i <= totalDays; i++) {
        const daySpan = document.createElement('span');
        daySpan.textContent = i <= 30 ? i : '';
        
        if (i <= 30) {
            if (activeDays.includes(i)) {
                daySpan.classList.add('active');
            }
            if (i === selectedDay) {
                daySpan.classList.add('selected');
            }
        } else {
            daySpan.classList.add('inactive');
        }

        daysContainer.appendChild(daySpan);
    }
});
