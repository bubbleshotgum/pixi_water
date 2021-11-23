let app, displacementSprite, displacementFilter,
    drops = []

function initPixi() {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xaaaaaa
    })
    document.body.appendChild(app.view)

    /*let image = new PIXI.Sprite.from("image.jpeg")
    image.width = window.innerWidth
    image.height = window.innerHeight

    app.stage.addChild(image)*/

    const style = new PIXI.TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 20 + (app.screen.width + app.screen.height) * .06,
        fill: '#000',
        dropShadow: false
    })

    const header = new PIXI.Text("MISSIONS", style)
    app.stage.addChild(header)
    header.anchor.set(.5)
    header.x = app.screen.width / 2
    header.y = app.screen.height / 4

    window.addEventListener('resize', function() { style.fontSize = 20 + (app.screen.width + app.screen.height) * .06 })

    createWaterDrop(0, 200)
    /* USED TO MAKE UNDERWATER EFFECT
    
    displacementSprite = new PIXI.Sprite.from("cloud.jpg")
    displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)
    
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    displacementSprite.scale = {x: 4, y: 4}
    app.stage.addChild(displacementSprite)
    app.stage.filters = [displacementFilter]
    app.renderer.view.style.transform = "scale(1.02)"
    
    */
}

function createWaterDrop(x, y)
{
    let geometry = new PIXI.Geometry(),
        material = new PIXI.MeshMaterial(PIXI.Texture.from("./waterdrop.png"))
    geometry.addAttribute('positions', [x,x, x,y, y,x, y,y], 2);
    geometry.addAttribute('uvs', [0,0, 0,1, 1,0, 1,1],2)
    geometry.addIndex([0,1,2, 1,3,2])

    material.alpha = .5
    let drop = new PIXI.Mesh(geometry, material)
    drop.verticesBuffer.static = false
    app.stage.addChild(drop)

    drops.push(drop)
}
let counter = 0,
    locked = null,
    lockedDirs = []
function animate() {
    // displacementSprite.x += 8
    // displacementSprite.y += 3
    counter++
    let i = 0
    drops.forEach(drop => {
        if(!locked)
        {
            locked = Math.floor(Math.random() * 2 + 5) * (Math.random() > .5 ? 1 : -1)
            lockedDirs.push([])
            for(; i < lockedDirs.length; i++)
            {
                lockedDirs[i] = []
                switch(Math.floor(Math.random() * 8 + 1))
                {
                    case 1:
                        lockedDirs[i].push(0)
                        lockedDirs[i].push(2)
                        break
                    case 2:
                        lockedDirs[i].push(1)
                        lockedDirs[i].push(5)
                        break
                    case 3:
                        lockedDirs[i].push(3)
                        lockedDirs[i].push(7)
                        break
                    case 4:
                        lockedDirs[i].push(4)
                        lockedDirs[i].push(6)
                        break
                    case 5:
                        lockedDirs[i].push(0)
                        lockedDirs[i].push(1)
                        break
                    case 6:
                        lockedDirs[i].push(2)
                        lockedDirs[i].push(3)
                        break
                    case 7:
                        lockedDirs[i].push(4)
                        lockedDirs[i].push(5)
                        break
                    case 8:
                        lockedDirs[i].push(6)
                        lockedDirs[i].push(7)
                        break
                    default:
                        lockedDirs[i] = null
                }
            }
            i = 0
        }
        if(lockedDirs[i])
            lockedDirs[i].forEach(index => {
                drop.verticesBuffer.data[index] += locked
            })
        drop.verticesBuffer.update()
        i++
    })
    if(counter >= 100)
    {
        createWaterDrop(Math.floor(Math.random() * app.screen.width), Math.floor(Math.random() * app.screen.height))
        counter = 0
        locked = null
        for(i = 0; i < lockedDirs.length; i++)
            lockedDirs[i] = null
    }
    requestAnimationFrame(animate)
}

initPixi()
requestAnimationFrame(animate)