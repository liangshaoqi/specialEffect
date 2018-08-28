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
    //头部
    drawHead(t) {
        ctx.save()
        ctx.beginPath()
        ctx.translate(0, Math.sin(t) * 4)
        ctx.arc(80, -35, 35, 0, 2 * Math.PI)//画圆
        ctx.fill()
        ctx.closePath()
        ctx.restore()//画完之后,回到原点
    }
    //身体
    drawBody(t) {
        ctx.beginPath()
        ctx.save()
        ctx.rotate(Math.sin(t) * Math.PI / 180 * - 1)
        ctx.translate(0, Math.sign(t) * 4)
        ctx.scale(0.5, 0.5)
        const body = new Path2D('M125,284 L1,284 C0.33333333,94.6666667 35,0 105,0 C115.666667,4 122.333333,20.6666667 125,50 L125,284 Z')
        ctx.fill(body)
        ctx.restore()
        ctx.closePath()
    }
    //脚
    drwaFeet(t) {
        //周期减半
        t = t / 2
        ctx.save()
        ctx.scale(0.5, 0.5)
        ctx.translate(0, 460)
        const feet = new Path2D('M23,0 C67,0 80,16 80,22 C80,26 78.6666667,28 76,28 C29.3333333,28 6,28 6,28 C6,28 -1.34111707e-14,30 0,17 C1.42108547e-14,4 10,1.9505735e-16 13,0 C16,0 13,0 23,0 Z')
        ctx.save()
        ctx.translate(Math.cos(t) * -50, Math.sin(t) > 0 ? Math.sin(t) * -35 : 0)
        if(t < Math.PI) {
            ctx.rotate(Math.sin(t) * Math.PI / 180 * -5)
        }
        ctx.fill(feet)
        ctx.restore()

        ctx.save()
        ctx.translate(Math.cos(t + Math.PI) * - 50, Math.sin(t + Math.PI) > 0 ? Math.sin(t + Math.PI) * -35 : 0)
        if(t > Math.PI) {
            ctx.rotate(Math.sin(t + Math.PI) * Math.PI/ 180 * -5)
        }
        ctx.fill(feet)
        ctx.restore()
        
        ctx.restore()
    }
    //阴影
    drawShadow(t) {
        ////重置当前路径
        ctx.beginPath()
        ctx.save()//临时保存,后续通过restore()来回复以前的值
        ctx.scale(0.5, 0.5)
        ctx.translate(45, 490)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        //绘制椭圆
        ctx.ellipse(0, 0, 120 + Math.sin(t) * 10, 8, 0, 0, 2 * Math.PI)
        ctx.fill()//填充
        ctx.restore()//
        ctx.closePath()//如果当前子路径是打开的,这个方法会通过添加一条线条连接当前点和子路径起始点来关闭它
    }
    draw(t) {
        t = t % Math.PI * 2
        ctx.fillStyle = 'white'//填充颜色
        ctx.save()
        ctx.translate(window.innerWidth * 0.5 - 140, window.innerHeight * 0.5 -80)
        this.drawHead(t)
        this.drawBody(t)
        this.drwaFeet(t)
        this.drawShadow(t)
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