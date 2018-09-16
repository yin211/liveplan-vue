export default function ColorsGenerator (specifier) {
  let n = specifier.length / 6 | 0
  let colors = new Array(n)
  let i = 0
  while (i < n) colors[i] = '#' + specifier.slice(i * 6, ++i * 6)
  return colors
}
