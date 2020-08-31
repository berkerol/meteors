/* global canvas ctx addPause loop paintLine generateRandomNumber resizeHandler backgroundCanvas */
const meteor = {
  lineCap: 'round',
  lineWidth: 4,
  shadowBlur: 20,
  shadowColor: '#B0B0B0',
  highestAlphaChange: 0.025,
  highestDistance: 400,
  highestLength: 80,
  highestSpeed: 10,
  lowestAlphaChange: 0.015,
  lowestDistance: 200,
  lowestLength: 40,
  lowestSpeed: 6,
  probability: 0.1
};

const meteors = [];

resizeHandler();
addPause();
window.addEventListener('resize', resizeHandler);

loop(function (frames) {
  ctx.drawImage(backgroundCanvas, 0, 0);
  ctx.lineCap = meteor.lineCap;
  ctx.lineWidth = meteor.lineWidth;
  ctx.shadowBlur = meteor.shadowBlur;
  ctx.shadowColor = meteor.shadowColor;
  for (const m of meteors) {
    const gradient = ctx.createLinearGradient(m.x, m.y, m.x + m.lengthX, m.y + m.lengthY);
    gradient.addColorStop(0, `rgba(112, 112, 112, ${m.alpha})`);
    gradient.addColorStop(0.2, `rgba(144, 144, 144, ${m.alpha})`);
    gradient.addColorStop(0.5, `rgba(176, 176, 176, ${m.alpha})`);
    gradient.addColorStop(0.8, `rgba(208, 208, 208, ${m.alpha})`);
    gradient.addColorStop(1, `rgba(240, 240, 240, ${m.alpha})`);
    paintLine(m.x, m.y, m.x + m.lengthX, m.y + m.lengthY, gradient);
  }
  if (Math.random() < meteor.probability) {
    createMeteors();
  }
  removeMeteors(frames);
});

function createMeteors () {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const length = generateRandomNumber(meteor.lowestLength, meteor.highestLength);
  const distance = generateRandomNumber(meteor.lowestDistance, meteor.highestDistance);
  const theta = 2 * Math.PI * Math.random();
  const lengthX = length * Math.cos(theta);
  const lengthY = length * Math.sin(theta);
  const distX = distance * Math.cos(theta);
  const distY = distance * Math.sin(theta);
  const norm = Math.sqrt(distX ** 2 + distY ** 2);
  const speed = generateRandomNumber(meteor.lowestSpeed, meteor.highestSpeed);
  const speedX = distX / norm * speed;
  const speedY = distY / norm * speed;
  meteors.push({
    x,
    y,
    alpha: 0,
    alphaChange: generateRandomNumber(meteor.lowestAlphaChange, meteor.highestAlphaChange),
    alphaStatus: 1,
    distX,
    distY,
    speedX,
    speedY,
    lengthX,
    lengthY
  });
}

function removeMeteors (frames) {
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    if (m.x < 0 || m.x > canvas.width || m.y < 0 || m.y > canvas.height) {
      meteors.splice(i, 1);
    } else {
      m.x += m.speedX * frames;
      m.y += m.speedY * frames;
      m.distX -= Math.abs(m.speedX) * frames;
      m.distY -= Math.abs(m.speedY) * frames;
      if (m.alphaStatus === 1) {
        if (m.alpha + m.alphaChange * frames < 1) {
          m.alpha += m.alphaChange * frames;
        } else {
          m.alpha = 1;
          m.alphaStatus = 0;
        }
      } else if (m.alphaStatus === 0) {
        if (m.distX < 0 && m.distY < 0) {
          m.alphaStatus = -1;
        }
      } else if (m.alphaStatus === -1) {
        if (m.alpha - m.alphaChange * frames > 0) {
          m.alpha -= m.alphaChange * frames;
        } else {
          meteors.splice(i, 1);
        }
      }
    }
  }
}
