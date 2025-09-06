export class Tooltip {
  constructor() {
    this._tooltips = [];
  }

  showTooltip(message, element) {
    const tooltipElement = document.createElement('div')
    tooltipElement.classList.add('.popover-form'); 
    const id = performance.now();
    
    this._tooltips.push({
      id,
      element: tooltipElement,
    });
    document.body.append(tooltipElement);

    const { top, left} = element.getBoundingClientRect();
    tooltipElement.style.position = 'absolute';
    
    //console.log(right, top, left, bottom)
    //console.log(tooltipElement.style)

    if (message.constructor == Object) {
      const messageTitle = message['title']
      const messageContent = message.content
      //console.log("message['title'], message.content", message['title'], message.content)

      tooltipElement.innerHTML = `
        <div class='popover'>
          <div class='popover-title'>${message['title']}</div>
          <div class='popover-content'>${message.content}</div>
        </div>
      `

      tooltipElement.style.left = left + element.offsetWidth / 2 - tooltipElement.offsetWidth / 2 + 'px';
      tooltipElement.style.top = top - tooltipElement.offsetHeight - 5  + 'px';

    } else {
      tooltipElement.textContent = message;
    }

    console.log('tooltipElement после textContent: ', tooltipElement)

    return id;
  }

  removeTooltip(id) {
    console.log('Функция удаления подсказки')
    const tooltip = this._tooltips.find(t => t.id === id);
    if (tooltip) {
      tooltip.element.remove();
      this._tooltips = this._tooltips.filter(t => t.id !== id);
    }
  }

}