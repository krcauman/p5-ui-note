import p5 from 'p5'
import './style.css'

const sketch = (p: p5) => {
  let taskbarOpen = false
  let writingMode = false
  let tool = 'pen'

  let strokes: {
    points: { x: number; y: number }[]
    color: string
    weight: number
  }[] = []

  let currentStroke: {
    points: { x: number; y: number }[]
    color: string
    weight: number
  } | null = null

  // 필기 모드 버튼 위치
  const toggleX = 1380
  const toggleY = 80
  const toggleW = 200
  const toggleH = 40

  // 펜 버튼
  const penX = 1180
  const penY = 80
  const penW = 60
  const penH = 40

  // 지우개 버튼
  const eraserX = 1250
  const eraserY = 80
  const eraserW = 90
  const eraserH = 40

  // 아래 작업표시줄 영역
  const taskbarY = 930
  const taskbarH = 150

  // 실제로 필기하는 종이 영역
  const noteX = 390
  const noteY = 170
  const noteW = 1080
  const noteH = 740

  p.setup = () => {
    p.createCanvas(1920, 1080)
  }

  p.draw = () => {
    // 배경
    p.noStroke()
    p.fill('#aedaf3ff')
    p.rect(0, 0, 1920, 1080)

    // 노트 창 바깥 프레임
    p.fill(0, 20)
    p.rect(250, 80, 1420, 986, 20)

    p.fill('#f8f8f8')
    p.rect(240, 70, 1420, 986, 20)

    p.fill('#ffffff')
    p.rect(240, 70, 1420, 60, 20, 20, 0, 0)

    p.fill('#222')
    p.textSize(26)
    p.text('Notes', 290, 108)

    p.fill('#efefef')
    p.rect(240, 130, 70, 840, 0, 0, 0, 20)

    p.fill('#f3f3f3')
    p.rect(1560, 130, 100, 840, 0, 0, 20, 0)

    // 노트 종이
    p.fill('#ffffff')
    p.rect(noteX, noteY, noteW, noteH, 8)

    // 줄
    p.stroke('#ebebeb')
    p.strokeWeight(1)
    for (let y = 230; y < noteY + noteH; y += 40) {
      p.line(430, y, 1430, y)
    }

    p.noStroke()
    p.fill('#333')
    p.textSize(22)
    p.text('Interactive UX Design', 430, 215)

    // 종이 안에서만 필기가 보이게 자름
    const ctx = p.drawingContext as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    ctx.rect(noteX, noteY, noteW, noteH)
    ctx.clip()

    // 이미 그린 선들
    for (let i = 0; i < strokes.length; i++) {
      const s = strokes[i]

      if (s.points.length < 2) continue

      p.noFill()
      p.stroke(s.color)
      p.strokeWeight(s.weight)
      p.strokeCap(p.ROUND)
      p.strokeJoin(p.ROUND)

      p.beginShape()
      for (let j = 0; j < s.points.length; j++) {
        p.vertex(s.points[j].x, s.points[j].y)
      }
      p.endShape()
    }

    // 지금 그리고 있는 선
    if (currentStroke && currentStroke.points.length > 0) {
      p.noFill()
      p.stroke(currentStroke.color)
      p.strokeWeight(currentStroke.weight)
      p.strokeCap(p.ROUND)
      p.strokeJoin(p.ROUND)

      p.beginShape()
      for (let i = 0; i < currentStroke.points.length; i++) {
        p.vertex(currentStroke.points[i].x, currentStroke.points[i].y)
      }
      p.endShape()
    }

    ctx.restore()

    // 펜 버튼
    p.fill(tool === 'pen' ? '#0078d4' : '#dddddd')
    p.rect(penX, penY, penW, penH, 10)
    p.fill(tool === 'pen' ? '#ffffff' : '#111111')
    p.textSize(16)
    p.text('펜', penX + 18, penY + 25)

    // 지우개 버튼
    p.fill(tool === 'eraser' ? '#0078d4' : '#dddddd')
    p.rect(eraserX, eraserY, eraserW, eraserH, 10)
    p.fill(tool === 'eraser' ? '#ffffff' : '#111111')
    p.textSize(16)
    p.text('지우개', eraserX + 18, eraserY + 25)

    // 필기 모드 토글
    p.fill('#f0f0f0')
    p.rect(toggleX, toggleY, toggleW, toggleH, 20)

    p.fill('#111')
    p.textSize(16)
    p.text('필기 모드', toggleX + 20, toggleY + 25)

    p.fill(writingMode ? '#34a853' : '#bbb')
    p.rect(toggleX + 120, toggleY + 8, 50, 24, 20)

    p.fill('#fff')
    if (writingMode) {
      p.circle(toggleX + 150, toggleY + 20, 20)
    } else {
      p.circle(toggleX + 130, toggleY + 20, 20)
    }

    // 작업표시줄 열렸을 때
    if (taskbarOpen) {
      p.noStroke()
      p.fill('#d7deec')
      p.rect(0, taskbarY, 1920, taskbarH)

      for (let i = 0; i < 6; i++) {
        p.fill('#fff')
        p.rect(700 + i * 90, 960, 60, 60, 12)

        p.fill('#0078d4')
        p.rect(715 + i * 90, 975, 30, 30, 8)
      }

      // 필기 모드일 때는 아래쪽 터치 막는 느낌만 보여줌
      if (writingMode) {
        p.noStroke()
        p.fill(120, 120, 120, 150)
        p.rect(0, taskbarY, 1920, taskbarH)

        p.stroke('#ffffffaa')
        p.strokeWeight(2)
        for (let x = 0; x < 1920; x += 18) {
          p.line(x, taskbarY, x + 10, taskbarY)
        }

        p.noStroke()
        p.fill('#ffffff')
        p.textSize(24)
        p.text('필기 모드', 860, 995)

        p.textSize(18)
        p.text('하단 터치 무시 영역', 835, 1025)
      }
    }

    // 아래 기본 바
    p.noStroke()
    p.fill('#a4bed5')
    p.rect(0, 1060, 1920, 20)

    p.fill('#000')
    p.textSize(14)
    p.text('A 한 🛜🔊🔋 오후 10:30', 1750, 1075)

    p.fill('#00000088')
    p.rect(860, 1067, 200, 5, 30)
  }

  p.mousePressed = () => {
    // 펜 버튼
    if (
      p.mouseX > penX &&
      p.mouseX < penX + penW &&
      p.mouseY > penY &&
      p.mouseY < penY + penH
    ) {
      tool = 'pen'
      return
    }

    // 지우개 버튼
    if (
      p.mouseX > eraserX &&
      p.mouseX < eraserX + eraserW &&
      p.mouseY > eraserY &&
      p.mouseY < eraserY + eraserH
    ) {
      tool = 'eraser'
      return
    }

    // 필기 모드 버튼
    if (
      p.mouseX > toggleX &&
      p.mouseX < toggleX + toggleW &&
      p.mouseY > toggleY &&
      p.mouseY < toggleY + toggleH
    ) {
      writingMode = !writingMode
      return
    }

    // 아래 얇은 바
    if (
      p.mouseX > 860 &&
      p.mouseX < 1060 &&
      p.mouseY > 1060 &&
      p.mouseY < 1080
    ) {
      if (writingMode) return
      taskbarOpen = !taskbarOpen
      return
    }

    // 펜일 때만 노트 안에서 새 선 시작
    if (
      tool === 'pen' &&
      p.mouseX > noteX &&
      p.mouseX < noteX + noteW &&
      p.mouseY > noteY &&
      p.mouseY < noteY + noteH
    ) {
      currentStroke = {
        points: [{ x: p.mouseX, y: p.mouseY }],
        color: '#111111',
        weight: 3
      }
      return
    }

    // 작업표시줄이 열려 있을 때 바깥 누르면 닫힘
    if (taskbarOpen) {
      const insideTaskbar =
        p.mouseX > 0 &&
        p.mouseX < 1920 &&
        p.mouseY > taskbarY &&
        p.mouseY < taskbarY + taskbarH

      if (writingMode && insideTaskbar) {
        return
      }

      if (!insideTaskbar) {
        taskbarOpen = false
      }
    }
  }

  p.mouseDragged = () => {
    // 노트 밖이면 무시
    if (
      p.mouseX < noteX ||
      p.mouseX > noteX + noteW ||
      p.mouseY < noteY ||
      p.mouseY > noteY + noteH
    ) {
      return
    }

    // 펜
    if (tool === 'pen') {
      if (!currentStroke) return
      currentStroke.points.push({ x: p.mouseX, y: p.mouseY })
    }

    // 지우개
    if (tool === 'eraser') {
      const eraseSize = 20

      for (let s = strokes.length - 1; s >= 0; s--) {
        for (let i = 0; i < strokes[s].points.length; i++) {
          const pt = strokes[s].points[i]

          if (
            pt.x > p.mouseX - eraseSize &&
            pt.x < p.mouseX + eraseSize &&
            pt.y > p.mouseY - eraseSize &&
            pt.y < p.mouseY + eraseSize
          ) {
            strokes.splice(s, 1)
            break
          }
        }
      }
    }
  }

  p.mouseReleased = () => {
    if (currentStroke) {
      if (currentStroke.points.length > 0) {
        strokes.push(currentStroke)
      }
      currentStroke = null
    }
  }
}

new p5(sketch)