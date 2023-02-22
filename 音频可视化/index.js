const audioEl = document.getElementById('audio')
const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')
// 初始化canvas的尺寸
function initCanvas () {
  cvs.width = window.innerWidth * devicePixelRatio;
  cvs.height = window.innerHeight / 2 * devicePixelRatio;

}
initCanvas()

let isInit = false
let analyser, dataArray
audioEl.onplay = () => {
  if (isInit) return
  // 初始化
  const audCtx = new AudioContext() // 创建音频上下文
  const source = audCtx.createMediaElementSource(audioEl) // 创建音频源节点
  analyser = audCtx.createAnalyser() // 分析器
  // 时域图--频谱分析(快速傅里叶变换)--->频域图
  analyser.fftSize = 512 // 必须2的n次幂
  dataArray = new Uint8Array(analyser.frequencyBinCount) // 转换后的频域图是左右对称,所有只需要一半 512 / 2
  source.connect(analyser)
  analyser.connect(audCtx.destination) // 分析器连接到输出设备
  isInit = true
}

// 把分析出的波形绘制到canvas上
let isSymmetry = true // 是否对称
function draw () {
  requestAnimationFrame(draw)
  // 清空画布
  const { width, height } = cvs
  ctx.clearRect(0, 0, width, height)
  if (!isInit) return
  // 让分析器节点分析出数据到数组中去
  analyser.getByteFrequencyData(dataArray)
  let len = dataArray.length / 1 // 声音后面大部分的频率是低频,不好展现,所有除掉后面一部分,被除数越大,代表后面的去除的越多,1表示展示所有的
  let barWidth = width / len
  if (isSymmetry) {
    barWidth = barWidth / 2
  }
  ctx.fillStyle = '#78C5F7'
  for (let i = 0; i < len; i++) {
    const data = dataArray[i] // <256
    const barHeight = data / 255 * height
    let x1 = i * barWidth
    if (isSymmetry) {
      x1 = x1 + width / 2
    }
    const x2 = width / 2 - (i + 1) * barWidth
    const y = height - barHeight
    ctx.fillRect(x1, y, barWidth - 2, barHeight)
    isSymmetry && ctx.fillRect(x2, y, barWidth - 2, barHeight)
  }
}
draw()

const btn = document.getElementById('btn')
btn.onclick = () => {
  isSymmetry = !isSymmetry
  draw()
}
