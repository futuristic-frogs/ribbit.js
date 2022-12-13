# Ribbit.js

Ribbit.js is a simple, sleek, and modern HTML game framework for 2D canvas games, written in TypeScript.

🛈 Note: Ribbit.js is still in early development, and is not yet ready for production use. 

## Installation

Ribbit.js is available on npm:

```bash
npm install @ffstudios/ribbit.js
yarn add @ffstudios/ribbit.js
```

## Architecture

Ribbit.js is object-oriented and is built around a few core concepts:

- A single game is controlled by a single **Ribbit** engine instance. It is responsible for managing the game loop, scenes, and textures.
- An engine can have multiple **Scenes**, which can be thought of as "levels" or "screens" in the game.
- Scenes can have multiple **GameObjects**, which are the basic building blocks of the game.
- GameObjects can have multiple **Components**, which are reusable pieces of functionality that can be added to game objects.

## Example

```js
import { Component, GameObject, Ribbit, Scene, Texture, Vec2d } from '@ffstudios/ribbit.js'
import { TextureRenderer } from '@ffstudios/ribbit.js/components'
import { vec } from '@ffstudios/ribbit.js/macros'
import { Rectangle } from '@ffstudios/ribbit.js/objects'

const random = (min: number, max: number) => Math.random() * (max - min) + min

class TestScene extends Scene {
  constructor(
    ribbit: Ribbit,
    public readonly frogTexture: Texture,
    public readonly frogCount = 10
  ) {
    super(ribbit)

    // add frogs
    for (let i = 0; i < frogCount; i++) {
      // create a new game object
      const rectangle = this.add(
        Rectangle,
        vec.random().mul(this.ribbit.canvas.width, this.ribbit.canvas.height),
        100,
        100
      )
      // add components
      rectangle.add(TextureRenderer, frog)
      rectangle.add(RotateComponent, rectangle.width, rectangle.height, random(0, 0.01))
      rectangle.add(TranslateComponent, vec.random().scale(random(-0.2, 0.2)))
    }
  }

  render(): void {
    const { ctx, canvas } = this.ribbit.layer()
    // draw background
    ctx.save()
    ctx.fillStyle = `rgb(30, 30, 40)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    // draw game objects
    super.render()
  }
}

const ribbit = new Ribbit(document.getElementById('canvas') as HTMLCanvasElement)

// load frog texture
const frogImage = new Image()
frogImage.src = 'frog.png'
const frog = ribbit.addTexture(frogImage, 0.1)

const scene = ribbit.addScene(TestScene, frog, 100)
ribbit.select(scene)
ribbit.run()
```

## License

Ribbit.js is licensed under the MIT license. See [LICENSE](LICENSE) for more information.
