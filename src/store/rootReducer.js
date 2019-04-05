import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import clientReducer from './client/reducer'
import signerReducer from './signer/reducer'

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['client', 'signer']
}

const clientPersistConfig = {
  key: 'client',
  storage,
  whitelist: ['config', 'release']
}

const rootReducer = combineReducers({
  client: persistReducer(clientPersistConfig, clientReducer),
  signer: persistReducer(signerReducer)
})

export default persistReducer(rootPersistConfig, rootReducer)
