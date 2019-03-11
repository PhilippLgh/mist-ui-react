import React, { Component } from 'react'
import { Mist } from '../../API'

const { geth } = Mist

export default class Terminal extends Component {
  state = {
    logs: []
  }

  constructor(props) {
    super(props)
    this.terminalScrollViewRef = React.createRef()
  }

  componentDidMount = async () => {
    await this.startPolling()
  }

  componentDidUpdate = () => {
    if (this.terminalScrollViewRef.current) {
      const { scrollHeight } = this.terminalScrollViewRef.current
      this.terminalScrollViewRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  refreshLogs = async () => {
    const logs = await geth.getLogs()
    this.setState({
      logs
    })
  }

  startPolling = () => {
    this.logsInterval = setInterval(this.refreshLogs, 1000)
  }

  stopPolling = () => {
    clearInterval(this.logsInterval)
    this.logsInterval = null
  }

  componentWillUnmount() {
    this.stopPolling()
  }

  render() {
    const { logs } = this.state

    return (
      <div key="terminalContainer">
        <div
          key="terminalWrapper"
          ref={this.terminalScrollViewRef}
          style={{
            fontFamily:
              'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
            fontSize: '9px',
            background: '#111',
            color: '#eee',
            maxHeight: 350,
            maxWidth: 680,
            overflowY: 'scroll',
            whiteSpace: 'nowrap',
            padding: 10
          }}
        >
          {logs.map((l, index) => (
            <div key={index}> &gt; {l}</div>
          ))}
        </div>
      </div>
    )
  }
}
