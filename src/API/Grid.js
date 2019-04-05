import ipc from './Ipc'
// import Web3 from 'web3'
// import store from './ReduxStore'

function showPopup(name, args) {
  ipc.send('backendAction_showPopup', {
    name,
    args
  })
}

const { _grid } = window

// let Ganache = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
// var web3 = new Web3(Ganache);

const GridApi = {
  geth: {
    getConfig: () => {
      return {}
    },
    getStatus: () => {
      return {}
    },
    getLocalBinaries: () => {
      return []
    },
    getReleases: () => {
      return []
    },
    getLogs: () => {
      return []
    },
    setConfig: () => {},
    on: () => {},
    rpc: () => {}
  },
  window: {
    getArgs() {
      let args = {}
      if (_grid) {
        args = _grid.window.getArgs()
      }
      return args
    }
  },
  requestAccount: () => {
    // window.grid.requestAccount
  },
  setWindowSize(w, h) {
    ipc.send('backendAction_setWindowSize', w, h)
  },
  closeThisWindow() {
    if (_grid) {
      _grid.window.close()
    }
  },
  createAccount(args) {
    showPopup('CreateAccount', args)
  },
  connectAccount(args) {
    showPopup('ConnectAccount', args)
  },
  sendTransaction(args) {
    showPopup('SendTx', args)
  },
  showHistory(args) {
    showPopup('TxHistory', args)
  },
  createAccountWeb3() {
    // return new Promise((resolve, reject) => {
    /*
      web3.eth.personal.newAccount(pw)
      .then(address => {
        store.dispatch({
          type: 'ADD_ACCOUNT',
          payload: {
            address: address,
            balance: 0
          }
        })
        resolve(address)
      })
      .catch(err => {
        console.log('account could not be created', err)
      })
      */
    // })
  },
  // replaces GlobalNotification
  notification: {
    warn: msg => {
      console.log('warn warn', msg)
      if (_grid) {
        _grid.notification.warn(msg.content)
      }
      /*
          GlobalNotification.warning({
            content: error.message || error,
            duration: 5
          });
      */
    }
  }
}

// window.Grid is made available by grid
const Grid = window.Grid ? window.Grid : GridApi

export default Grid
