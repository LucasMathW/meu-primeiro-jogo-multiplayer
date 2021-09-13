export default function createGame(){

  const state = {
      players: {
      },
      fruits: {
      },
      screen: {
        width: 10,
        height: 10
      }
    }

    const observers = [];

    function start(){
        const frequency = 2000
        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        console.log(`notifying that ${observers.length} observing`)
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }

  function addPlayer(command){
      const playerId = command.playerId
      const coordinateX = 'coordinateX' in command ? command.coordinateX : Math.floor(Math.random() * state.screen.width)
      const coordinateY = 'coordinateY' in command ? command.coordinateY : Math.floor(Math.random() * state.screen.height)

      state.players[playerId] = {
          x : coordinateX,
          y : coordinateY
        }

      notifyAll({
        type : 'add-player',
        playerId : playerId,
        coordinateX : coordinateX,
        coordinateY : coordinateY
      })
  }
  function setState(newState){
    Object.assign(state, newState)
  }

  function addFruit(command){
      const fruitId = command ?  command.fruitId : Math.floor(Math.random() * 10000000)
      const coordinateX = command ? command.coordinateX : Math.floor(Math.random() * state.screen.width)
      const coordinateY =  command ? command.coordinateY : Math.floor(Math.random() * state.screen.height)

      state.fruits[fruitId] = {
          x : coordinateX,
          y : coordinateY
      }

      notifyAll({
        type: 'add-fruit',
        fruitId : fruitId,
        coordinateX: coordinateX,
        coordinateY: coordinateY
      })
  }

  function removePlayer(command){
      const playerId = command.playerId
      delete state.players[playerId]

      notifyAll({
        type: 'remove-player',
        playerId : playerId
      })
  }

  function removeFruit(command){
      const fruitId = command.fruitId
      delete state.fruits[fruitId]

      notifyAll({
        type : 'remove-fruit',
        fruitId : fruitId
      })
  }

  function movePlayer(command){
      notifyAll(command)

      console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

      const acceptsMovements = {
          ArrowUp(player){
              console.log('game.movePlayer().ArrowUp()')
              if(player.y -1 >= 0){
                  player.y--
              }
          },
          ArrowDown(player){
              console.log('game.movePlayer().ArrowDown()')
              if(player.y + 1 < state.screen.height){
                  player.y++
              }
          },
          ArrowLeft(player){
              console.log('game.movePlayer().ArrowLeft()')
              if(player.x - 1 >= 0 ){
                  player.x--
              }
          },
          ArrowRight(player){
              console.log('game.movePlayer().ArrowRight()')
              if(player.x + 1 < state.screen.width){
                  player.x++
              }
          }
      }

      const playerId = command.playerId
      const player = state.players[playerId]
      const keyPressed = command.keyPressed
      const movingPlayer = acceptsMovements[keyPressed]

      if(player && movingPlayer){
          movingPlayer(player)
          verifyCollision(playerId)
      }
  }

  function verifyCollision(playerId){
      const player = state.players[playerId]

      for(const fruitId in state.fruits){
        const fruit = state.fruits[fruitId]
        console.log('FRUIT', fruit)

          if(player.x === fruit.x & player.y === fruit.y){
              console.log(`player ${player} match with fruit ${fruitId} `)
              removeFruit({fruitId : fruitId})
          }
      }
  }

  return {
      start,
      addPlayer,
      removePlayer,
      addFruit,
      removeFruit,
      state,
      setState,
      movePlayer,
      subscribe,
      verifyCollision
  }
}
