import { ELEMENTS } from './elements';

export function showHowToDivideDataBitStreamInBlocks(dataBlocks) {
  // clear previous calculation
  ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.innerHTML = '';

  dataBlocks.forEach((block) => {
    const svgBlock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBlock.setAttribute('viewBox', `0 0 ${block.length} 1`);
    svgBlock.classList.add('data-block');

    for (let moduleI = 0; moduleI < block.length; moduleI++) {
      const svgModule = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgModule.setAttribute('x', moduleI);
      svgModule.setAttribute('y', 0);
      svgModule.setAttribute('width', 1);
      svgModule.setAttribute('height', 1);
      svgModule.setAttribute('fill', block[moduleI].bit === '0' ? block[moduleI].lightColor : block[moduleI].darkColor);
      svgBlock.append(svgModule);

      if (block[moduleI].letter !== '') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', moduleI + 0.5);
        text.setAttribute('y', 0.75);
        text.setAttribute('fill', block[moduleI].bit === '0' ? block[moduleI].darkColor : block[moduleI].lightColor);
        text.textContent = block[moduleI].letter;
        const fontSize = block[moduleI].letter.length > 3 ? '0.020rem' : '0.035rem';
        text.style.fontSize = fontSize;
        svgBlock.append(text);
      }
    }

    ELEMENTS.HOW_TO_SPLIT_IN_BLOCKS.append(svgBlock);
  });
}
