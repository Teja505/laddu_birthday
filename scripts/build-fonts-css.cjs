const fs = require('fs');
const css = fs.readFileSync('src/fonts/google-fonts.css', 'utf8');
const blocks = css.split('@font-face').slice(1).map((b) => '@font-face' + b);
const latinBlocks = blocks.filter((b) => b.includes('U+0000-00FF') && !b.includes('U+1F00'));
const rewritten = latinBlocks.map((b) =>
  b.replace(/https:\/\/fonts\.gstatic\.com\/\S+?\/([\w-]+\.woff2)/, './files/$1')
);
fs.writeFileSync('src/fonts/fonts.css', rewritten.join('\n'));
console.log('blocks kept:', latinBlocks.length);
