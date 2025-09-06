import { Tooltip } from "./tooltip";

const form = document.querySelector('.form');

const errors = {
  "btn": {
    valueMissing: 'Не хватает значения',
    typeMismatch: 'Неправильный тип данных',
    customError: 'Кастомная ошибка',
    badInput: 'Ошибка обработки ввода',
    patternMismatch: 'Не соотвтетствует паттерну',
    rangeOverflow: 'Выше установленного диапазона',
    rangeUnderflow: 'Ниже установленного диапазона',
    stepMismatch: 'Не соответствует установленному шагу',
    tooLong: 'Слишком длинно',
    tooShort: 'Слишком коротко'
  }
};


const tooltipFactory = new Tooltip();
let actualMessages = [];

const showTooltip = (message, el) => {
  actualMessages.push({
    name: el.name,
    id: tooltipFactory.showTooltip(message, el),
  });
}


const getPopover = (el) => {
  const errorKey = Object.keys(ValidityState.prototype).find((key) => {
    if (key === 'valid') return;
    return el.validity[key];
  });

  if (!errorKey) {
    if (el.dataset.title && el.dataset.content) {
      const popover = {'title': el.dataset.title, 'content': el.dataset.content}
      return popover;
    } else {
      return
    }
  } else {
    const error = {'title': errorKey, 'content': errors[el.name][errorKey]}
    return error;
  }
};


form.addEventListener('click', (e) => addPopover(e))

function addPopover(e) {
  e.preventDefault();
 
  actualMessages.forEach((message) => tooltipFactory.removeTooltip(message.id));
  actualMessages = [];
  
  if (e.target.dataset.popover) {
    const popover = getPopover(e.target);
    showTooltip(popover, e.target);
    return true;
  }
};


const elementOnBlur = (e) => {
  const el = e.target;
  const currentMessage = actualMessages.find(item => item.name === el.name); 
  if (currentMessage) {
    tooltipFactory.removeTooltip(currentMessage.id);
  }
  
  el.removeEventListener('blur', elementOnBlur);
};


[...form.elements].forEach(el => el.addEventListener('focus', () => {
  el.addEventListener('blur', elementOnBlur);
}));
