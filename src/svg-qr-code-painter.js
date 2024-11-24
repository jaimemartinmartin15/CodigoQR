import { defaultDarkColor } from './colors';
import { MODULE_TYPE } from './module-type';

export function paintSvgQrCode(svgSelector, qrCodeMatrix, options) {
  const mergedOptions = { withGrid: true, margin: 0.025, labels: false, ...options };

  // select and clear previous results
  const svg = document.querySelector(svgSelector);
  svg.querySelectorAll('*').forEach((e) => e.remove());

  svg.setAttribute(
    'viewBox',
    `${-mergedOptions.margin} ${-mergedOptions.margin} ${qrCodeMatrix.length + mergedOptions.margin * 2} ${
      qrCodeMatrix.length + mergedOptions.margin * 2
    }`
  );

  for (let row = 0; row < qrCodeMatrix.length; row++) {
    for (let column = 0; column < qrCodeMatrix.length; column++) {
      const module = qrCodeMatrix[row][column];
      if (module.type !== MODULE_TYPE.NOT_DEFINED) {
        const svgModule = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        svgModule.setAttribute('x', column);
        svgModule.setAttribute('y', row);
        svgModule.setAttribute('width', 1);
        svgModule.setAttribute('height', 1);
        svgModule.setAttribute('fill', module.bit === '0' ? module.lightColor : module.darkColor);
        svgModule.setAttribute('stroke-width', '0');
        svg.append(svgModule);

        if (mergedOptions.labels && module.letter) {
          const svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          svgLabel.setAttribute('x', column + 0.5);
          svgLabel.setAttribute('y', row + 0.8);
          svgLabel.setAttribute('text-anchor', 'middle');
          svgLabel.setAttribute('fill', module.bit === '0' ? module.darkColor : module.lightColor);
          svgLabel.textContent = module.letter;
          svgLabel.style.fontSize = '0.04rem';
          svg.append(svgLabel);
        }
      }
    }
  }

  if (mergedOptions.withGrid) {
    for (let row = 0; row <= qrCodeMatrix.length; row++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', row);
      line.setAttribute('x2', qrCodeMatrix.length);
      line.setAttribute('y2', row);
      line.setAttribute('stroke', defaultDarkColor);
      line.setAttribute('stroke-width', 0.05);
      svg.append(line);
    }

    for (let column = 0; column <= qrCodeMatrix.length; column++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', column);
      line.setAttribute('y1', 0);
      line.setAttribute('x2', column);
      line.setAttribute('y2', qrCodeMatrix.length);
      line.setAttribute('stroke', defaultDarkColor);
      line.setAttribute('stroke-width', 0.05);
      svg.append(line);
    }
  }
}
