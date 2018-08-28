const canvas = {
    //初始化,返回canvas对象
    init() {
        this.ele = document.createElement('canvas')//新建canvas元素
        document.body.appendChild(this.ele)
        this.resize()
        window.addEventListener('resize', () => {
            this.resize()
        }, false)
        this.ctx = this.ele.getContext('2d')//获取对象
        return this.ctx
    },
    onResize(callback) {
        this.resizeCallback = callback
    },
    //
    resize() {
        this.width = this.ele.width = window.innerWidth * 2
        this.height = this.ele.height = window.innerHeight * 2
        this.ele.style.width = this.ele.width * 0.5 + 'px'
        this.ele.style.height = this.ele.height * 0.5 + 'px'
        this.ctx = this.ele.getContext('2d')
        this.ctx.scale(2, 2)
        this.resizeCallback && this.resizeCallback()
    },
    run(callback) {
        requestAnimationFrame(() => {
            this.run(callback)
        }) 
        callback(this.ctx)
    },
}
const ctx = canvas.init()//获取canvas对象

let objects = []

//人物形象绘画
class SadMan {
    drawHead(t) {
        ctx.save()
        ctx.beginPath()
        ctx.translate(0, Math.sin(t) * 4)
        ctx.arc(80, -35, 35, 0, 2 * Math.PI)//画圆
        ctx.fill()
        ctx.closePath()
        ctx.restore()//画完之后,回到原点
    }
    draw(t) {
        t = t % Math.PI * 2
        ctx.fillStyle = 'white'//填充颜色
        ctx.save()
        ctx.translate(window.innerWidth * 0.5 - 140, window.innerHeight * 0.5 -80)
        this.drawHead(t)
        ctx.restore()
    }
}
const init = () => {
    objects = []
    objects.push(new SadMan())
}

document.addEventListener('click', () => {
    init()
})
init()
let tick = 0
canvas.run(ctx => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    tick += 0.03
    objects.forEach(obj => {
        obj.draw(tick)
    })
})
canvas.onResize(() => {
    init()
})