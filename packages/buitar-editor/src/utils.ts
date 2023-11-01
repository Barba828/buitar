export function printElement(elementId: string) {
    // // 隐藏除了指定 DOM 元素之外的内容
    // const allElements: NodeListOf<HTMLElement> = document.querySelectorAll('body > *:not(#' + elementId + ')');
    // allElements.forEach(function(element) {
    //   element.style.display = 'none';
    // });
  
    // // // 打印指定 DOM 元素
    // const elementToPrint = document.getElementById(elementId);

    // let tempEl = elementToPrint
    // while (tempEl?.parentElement && tempEl?.parentElement !== document.body) {
    //     tempEl.style.display = 'block';
    //     console.log('lnz tempEl?.parentElement', tempEl?.parentElement);
    //     tempEl = tempEl?.parentElement
    // }
    // console.log('lnz elementToPrint', elementToPrint);

    window.print();


  
    // // 恢复显示所有内容
    // allElements.forEach(function(element) {
    //   element.style.display = '';
    // });
  }