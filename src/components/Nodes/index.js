import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClientConfig from './ClientConfig'
import ServicesNav from './ServicesNav'
import {
  initClient,
  selectClient,
  setConfig,
  toggleClient
} from '../../store/client/actions'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class NodesTab extends Component {
  static propTypes = {
    clientState: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    clients: [],
    selectedClient: undefined
  }

  componentDidMount() {
    if (!PluginHost) return
    const plugins = PluginHost.getAllPlugins()
    this.initClients(plugins)
  }

  initClients = clients => {
    const { dispatch } = this.props

    // Sync clients with redux
    clients.map(client => dispatch(initClient(client)))

    // Set the selected client
    const selectedClient =
      clients.find(client => client.order === 1) || clients[0]
    this.handleSelectClient(selectedClient)

    // TODO: two sources of truth - local and redux state
    this.setState({ clients })
  }

  isDisabled = client => {
    const { selectedRelease } = client
    return !selectedRelease
  }

  handleSelectClient = client => {
    const { dispatch } = this.props

    this.setState({ selectedClient: client }, () => {
      dispatch(selectClient(client.name))
    })
  }

  handleClientConfigChanged = (key, value) => {
    const { clientState, dispatch } = this.props
    const { selectedClient } = this.state

    // WARNING: if selected client is destructured
    /**
     * newSelectedClient = {
     *  ...selectedClient
     * }
     * the reference to the remote object in main is killed in this process
     */

    const { config } = clientState[clientState.selected]
    const newConfig = { ...config }
    newConfig[key] = value

    selectedClient.selectedConfig = newConfig
    this.setState({ selectedClient }, () => {
      dispatch(setConfig(clientState.selected, newConfig))
    })
  }

  handleReleaseSelect = release => {
    const { selectedClient } = this.state
    selectedClient.selectedRelease = release
    this.setState({ selectedClient, selectedRelease: release })
  }

  handleToggle = client => {
    const { clientState, dispatch } = this.props
    // TODO: refactor to only require clientName to toggle?
    dispatch(toggleClient(client, clientState[client.name].release))
  }

  render() {
    const { clients, selectedClient, selectedRelease } = this.state

    return (
      <ServicesNav
        handleToggle={this.handleToggle}
        handleSelectClient={this.handleSelectClient}
        clients={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            selectedRelease={selectedRelease}
            handleClientConfigChanged={this.handleClientConfigChanged}
            handleReleaseSelect={this.handleReleaseSelect}
          />
        )}
      </ServicesNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    clientState: state.client
  }
}

export default connect(mapStateToProps)(NodesTab)
