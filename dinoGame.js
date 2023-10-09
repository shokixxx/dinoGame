const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth // スマートフォンの画面幅に合わせる
canvas.height = window.innerHeight // スマートフォンの画面高さに合わせる

const ctx = canvas.getContext('2d')
const imageNames = ['bird', 'cactus', 'dino']

const game = {
  counter: 0,
  backGrounds: [],
  enemies: [],
  image: {},
  isGameOver: true,
  score: 0,
  timer: null,
}

let imageLoadCounter = 0
for (const imageName of imageNames) {
  const imagePath = `images/${imageName}.png`
  game.image[imageName] = new Image()
  game.image[imageName].src = imagePath
  game.image[imageName].onload = () => {
    imageLoadCounter += 1
    if (imageLoadCounter === imageNames.length) {
      console.log('画像のロードが完了しました')
      init()
    }
  }
}

function init() {
  game.counter = 0
  game.enemies = []
  game.isGameOver = false
  game.score = 0
  createDino()
  game.timer = setInterval(ticker, 30)
}

function ticker() {
  // 画面クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 背景の作成
  if (game.counter % 10 === 0) {
    createBackGround()
  }

  // 敵キャラの生成
  if (Math.floor(Math.random() * (100 - game.score / 100)) === 0) {
    createCactus()
  }

  if (Math.floor(Math.random() * (200 - game.score / 100)) === 0) {
    createBird()
  }

  // キャラクタの移動
  moveBackGrounds()
  moveDino()
  moveEnemies()

  // 描画
  drawBackGrounds()
  drawDino()
  drawEnemies()
  drawScore()

  // 当たり判定
  hitCheck()

  // カウンタの更新
  game.score += 1
  game.counter = (game.counter + 1) % 1000000
}

function createBackGround() {
  game.backGrounds = []
  for (let x = 0; x <= canvas.width; x += 200) {
    game.backGrounds.push({
      x: x,
      y: canvas.height,
      width: 200,
      moveX: -20,
    })
  }
}

function createDino() {
  game.dino = {
    // 中心の位置で管理
    x: game.image.dino.width / 2,
    y: canvas.height - game.image.dino.height / 2,
    moveY: 0,
    width: game.image.dino.width,
    height: game.image.dino.height,
    image: game.image.dino,
  }
}

function createCactus() {
  game.enemies.push({
    x: canvas.width + game.image.cactus.width / 2,
    y: canvas.height - game.image.cactus.height / 2,
    width: game.image.cactus.width,
    height: game.image.cactus.height,
    moveX: -10,
    image: game.image.cactus,
  })
}

function createBird() {
  const birdY = Math.random() * (700 - game.image.bird.height) + 150
  game.enemies.push({
    x: canvas.width + game.image.bird.width / 2,
    y: birdY,
    width: game.image.bird.width,
    height: game.image.bird.height,
    moveX: -15,
    image: game.image.bird,
  })
}

document.addEventListener('touchstart', () => {
  if (game.dino.moveY === 0) {
    game.dino.moveY = -41
  } else if (game.isGameOver) {
    init()
  }
})

document.onkeydown = (event) => {
  if (event.key === ' ' && game.dino.moveY === 0) {
    game.dino.moveY = -41
  }
  if (event.key === 'Enter' && game.isGameOver) {
    init()
  }
}

function moveBackGrounds() {
  for (const backGround of game.backGrounds) {
    backGround.x += backGround.moveX
  }
}

function moveDino() {
  game.dino.y += game.dino.moveY
  if (game.dino.y >= canvas.height - game.dino.height / 2) {
    game.dino.y = canvas.height - game.dino.height / 2
    game.dino.moveY = 0
  } else {
    game.dino.moveY += 3
  }
}

function moveEnemies() {
  for (const enemy of game.enemies) {
    enemy.x += enemy.moveX
  }
  //  画面外に出たキャラクタを配列から削除
  game.enemies = game.enemies.filter((enemy) => enemy.x > -enemy.width)
}

function drawBackGrounds() {
  ctx.fillStyle = 'sienna'
  for (const backGround of game.backGrounds) {
    ctx.fillRect(backGround.x, backGround.y - 5, backGround.width, 5)
    ctx.fillRect(backGround.x + 20, backGround.y - 10, backGround.width - 40, 5)
  }
}

function drawDino() {
  // 画像の左上を求める
  ctx.drawImage(
    game.image.dino,
    game.dino.x - game.dino.width / 2,
    game.dino.y - game.dino.height / 2
  )
}

function drawEnemies() {
  for (const enemy of game.enemies) {
    ctx.drawImage(
      enemy.image,
      enemy.x - enemy.width / 2,
      enemy.y - enemy.height / 2
    )
  }
}

function drawScore() {
  ctx.fillStyle = 'black'
  ctx.font = '24px serif'
  ctx.fillText(`score:${game.score}`, 0, 30)
}

function hitCheck() {
  for (const enemy of game.enemies) {
    if (
      Math.abs(game.dino.x - enemy.x) <
        (game.dino.width * 0.8) / 2 + (enemy.width * 0.9) / 2 &&
      Math.abs(game.dino.y - enemy.y) <
        (game.dino.height * 0.5) / 2 + (enemy.height * 0.8) / 2
    ) {
      game.isGameOver = true
      ctx.fillStyle = 'black'
      ctx.font = 'bold 30px serif'
      ctx.fillText('Game Over!', 0, 200)
      clearInterval(game.timer)
    }
  }
}
