import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectors = {
  startBtn: document.querySelector('[data-start]'),
  daysVal: document.querySelector('[data-days]'),
  hoursVal: document.querySelector('[data-hours]'),
  minutesVal: document.querySelector('[data-minutes]'),
  secondsVal: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const chosenDate = selectedDates[0].getTime();
    const currentDate = Date.now();

    if (chosenDate < currentDate) {
      selectors.startBtn.disabled = true;
      Notify.failure('Please choose a date in the future');
    } else {
      selectors.startBtn.disabled = false;
    }
  },
};

const datePicker = flatpickr('#datetime-picker', options);
let intervalId = null;

selectors.startBtn.addEventListener('click', onTimerStartClick);

function onTimerStartClick() {
  const startDate = new Date(datePicker.element.value).getTime();

  intervalId = setInterval(() => {
    const currentDate = Date.now();
    const timeComponents = convertMs(startDate - currentDate);
    checkToClear(startDate, currentDate);
    updateTimerContent(timeComponents);
  }, 1000);
}

function updateTimerContent({ days, hours, minutes, seconds }) {
  selectors.daysVal.textContent = days;
  selectors.hoursVal.textContent = hours;
  selectors.minutesVal.textContent = minutes;
  selectors.secondsVal.textContent = seconds;
}

function checkToClear(dateStart, dateCurrent) {
  const startDateStr = String(new Date(dateStart));
  const currentDateStr = String(new Date(dateCurrent + 1000));

  if (startDateStr === currentDateStr) {
    clearInterval(intervalId);
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
