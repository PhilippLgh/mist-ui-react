import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Clef from '../../../store/signer/clefService'
import RequestInfo from './RequestInfo'

const styles = () => ({
  controls: { marginTop: 15 },
  approve: { backgroundColor: 'green' },
  reject: { backgroundColor: 'red', marginRight: 10 }
})

class ApproveListing extends Component {
  static propTypes = {
    request: PropTypes.object,
    dispatch: PropTypes.func,
    classes: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { request } = this.props
    const { accounts } = request.params[0]
    accounts.forEach(account => {
      account.checked = true // eslint-disable-line
    })
    this.state = {
      accounts
    }
  }

  handleChange = account => event => {
    const { accounts: oldAccounts } = this.state
    const accounts = [...oldAccounts]
    accounts.find(a => a.address === account.address).checked =
      event.target.checked
    this.setState({ accounts })
  }

  approve() {
    const { request, dispatch } = this.props
    const { accounts } = this.state
    const { id } = request
    const enabledAccounts = []
    accounts.forEach(account => {
      if (account.checked) {
        // Remove `checked` property
        const clone = Object.assign({}, account)
        delete clone.checked
        enabledAccounts.push(clone)
      }
    })
    const result = { accounts: enabledAccounts }
    const message = { id, result }
    console.log(result)
    Clef.sendClef(message, dispatch)
  }

  reject() {
    const { request, dispatch } = this.props
    const { id } = request
    const result = { accounts: [] }
    const message = { id, result }
    Clef.sendClef(message, dispatch)
  }

  renderAccounts() {
    const { accounts } = this.state
    const renderAccounts = []
    accounts.forEach(account => {
      const thisRender = (
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={account.checked}
              onChange={this.handleChange(account)}
              value={account.address}
            />
          }
          label={account.address}
        />
      )
      renderAccounts.push(thisRender)
    })
    return <FormGroup>{renderAccounts}</FormGroup>
  }

  renderControls() {
    const { classes } = this.props
    return (
      <div classes={{ root: classes.controls }}>
        <Button
          onClick={() => {
            this.reject()
          }}
          classes={{ root: classes.reject }}
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            this.approve()
          }}
          classes={{ root: classes.approve }}
        >
          Approve
        </Button>
      </div>
    )
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h2">Approve Account Listing</Typography>
        <RequestInfo request={request} />
        {this.renderAccounts()}
        {this.renderControls()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    signer: state.signer
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
