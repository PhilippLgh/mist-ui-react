import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {
  dismissFlagWarning,
  setCustomFlags
} from '../../../../store/plugin/actions'
import Notification from '../../../shared/Notification'

class FlagPreview extends Component {
  static propTypes = {
    plugin: PropTypes.object,
    isPluginRunning: PropTypes.bool,
    flags: PropTypes.array,
    isEditingFlags: PropTypes.bool,
    toggleEditGeneratedFlags: PropTypes.func,
    dispatch: PropTypes.func,
    showWarning: PropTypes.bool
  }

  toggleEdit = event => {
    const { toggleEditGeneratedFlags } = this.props
    toggleEditGeneratedFlags(event.target.checked)
  }

  handleChange = event => {
    const { dispatch, plugin } = this.props
    const flags = event.target.value.split(' ')
    const pluginName = plugin[plugin.selected].name
    dispatch(setCustomFlags(pluginName, flags))
  }

  dismissFlagWarning = () => {
    const { dispatch } = this.props
    dispatch(dismissFlagWarning())
  }

  render() {
    const { flags, isEditingFlags, isPluginRunning, showWarning } = this.props

    return (
      <React.Fragment>
        <FormGroup row>
          <TextField
            label="Generated Flags"
            variant="outlined"
            multiline
            value={flags.join(' ')}
            onChange={this.handleChange}
            disabled={isPluginRunning || !isEditingFlags}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={isEditingFlags}
                onChange={this.toggleEdit}
                disabled={isPluginRunning}
                style={{ marginLeft: 10 }}
              />
            }
            label="Use custom flags"
          />
        </FormGroup>
        {isEditingFlags && showWarning && (
          <Notification
            type="warning"
            message="Use caution! Don't take flags from strangers."
            onDismiss={this.dismissFlagWarning}
          />
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    showWarning: state.plugin.showCustomFlagWarning
  }
}

export default connect(mapStateToProps)(FlagPreview)
