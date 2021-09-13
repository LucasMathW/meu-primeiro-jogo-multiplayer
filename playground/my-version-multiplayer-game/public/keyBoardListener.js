export default function createListenerKeyboard(document){
  const state = {
      observes : [],
      playerId : null
  }

  function subscribe(observerFunction){
     state.observes.push(observerFunction)
  }

  function subscribePLayer(playerId){
     state.playerId = playerId 
  }

  function notifyAll(command){
       console.log(`notifying that ${state.observes.length} observing`)
       for(const observerFunction of state.observes){
          observerFunction(command)
       }
  }

  document.addEventListener('keydown', handleKeydown)

  function handleKeydown(event){
      const keyPressed = event.key

      const command = {
          type: 'move-player',
          playerId : state.playerId,
          keyPressed
      }
      
      notifyAll(command)
  }

  return {
      subscribe,
      subscribePLayer
  }
}