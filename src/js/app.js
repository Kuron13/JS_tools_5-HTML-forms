import { Tooltip } from "./tooltip";

const form = document.querySelector('.form');
console.log('Элементы формы:', form.elements)

//Массив выводящихся ошибок
const errors = {
  "btn": {
    //valid: 'valid - Всё хорошо',
    valueMissing: 'valueMissing - Не хватает значения',
    typeMismatch: 'typeMismatch - Неправильный тип данных',
    customError: 'customError - Непонятная пользовательская ошибка',
    badInput: 'badInput - Ошибка обработки ввода',
    patternMismatch: 'patternMismatch - Не соотвтетствует паттерну',
    rangeOverflow: 'rangeOverflow - Выше установленного диапазона',
    rangeUnderflow: 'rangeUnderflow - Ниже установленного диапазона',
    stepMismatch: 'stepMismatch - Не соответствует установленному шагу',
    tooLong: 'tooLong - Слишком длинно',
    tooShort: 'tooShort - Слишком коротко'
  }
};


//Создаём экземпляр фабрики тултипов
const tooltipFactory = new Tooltip();
let actualMessages = [];

const showTooltip = (message, el) => {
  console.log('Показываем новую подсказку для ', el)
  console.log('message, el: ', message, el)
  actualMessages.push({
    name: el.name,
    id: tooltipFactory.showTooltip(message, el),
  });
}


// Функция валидации
const getError = (el) => {
  console.log('Получили ошибку для ', el)
  const errorKey = Object.keys(ValidityState.prototype).find((key) => {
    if (key === 'valid') return;

    //console.log('key: ', key)
    //console.log('el: ', el)

    //console.log('el.validity[key]: ', el.validity[key])

    return el.validity[key];
  });

  console.log('errorKey', errorKey)

  if (!errorKey) {
    console.log('el', el)
    if (el.dataset.title && el.dataset.content) {
      const popover = {'title': el.dataset.title, 'content': el.dataset.content}
      return popover;
    } else {
      return
    }
  }  
  
  return errors[el.name][errorKey];
};


//Проверка валидности формы

//form.addEventListener('submit', (e) => addPopover(e))
form.addEventListener('click', (e) => addPopover(e))

function addPopover(e) {
  e.preventDefault();
  console.log('Обрабатываем кнопку')

  //Убрать все активные сообщения
  //console.log('actualMessages', actualMessages)
  
  actualMessages.forEach((message) => {
    //console.log('message.id', message.id)
    tooltipFactory.removeTooltip(message.id)
  });


  //actualMessages.forEach((message) => tooltipFactory.removeTooltip(message.id));
  
  //console.log('actualMessages', actualMessages)
  actualMessages = [];
  //console.log('Очищенный actualMessages', actualMessages)
  
  if (form.checkValidity()) {
    console.log('Валидно');
  } else {
    console.log('Не валидно');
  }
  
  
  const elements = form.elements;
  
  console.log(e)
  console.log(e.target)
  console.log(e.target.dataset.popover)
  
  if (e.target.dataset.popover) {
      const error = getError(e.target);
      console.log('error: ', error)
      //console.log('Показать новую подсказку')
      showTooltip(error, e.target);
      return true;
    }

  //[...elements].some(elem => {
  //  if (elem.popover) {
  //    const error = getError(elem);
  //    console.log('error: ', error)
  //    //console.log('Показать новую подсказку')
  //    showTooltip(error, elem);
  //    return true;
  //  }
  //});
  
  console.log('Submit');
};


const elementOnBlur = (e) => {
  console.log('Функция скрытия подсказки')
  const el = e.target;
  const error = getError(el);

  const currentErrorMessage = actualMessages.find(item => item.name === el.name);
  //console.log('currentErrorMessage:', currentErrorMessage)  
  if (currentErrorMessage) {
    //console.log('Скрытие подсказки')
    tooltipFactory.removeTooltip(currentErrorMessage.id);
  }
  
  el.removeEventListener('blur', elementOnBlur);
  console.log('Отписались от скрытия')
};


[...form.elements].forEach(el => el.addEventListener('focus', () => {
  el.addEventListener('blur', elementOnBlur);
  console.log('Подписались на скрытие при потере фокуса')
}));



