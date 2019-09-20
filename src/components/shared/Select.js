import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import MuiSelect from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

export default class Select extends Component {
  static displayName = 'Select'

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    options: PropTypes.array,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    options: [],
    disabled: false
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.value || '',
      labelWidth: 0
    }
  }

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    })
  }

  handleChange = e => {
    const { onChange } = this.props

    this.setState({ value: e.target.value }, () => {
      if (onChange) onChange(e.target.value)
    })
  }

  render() {
    const { name, id, options, disabled } = this.props
    const { labelWidth, value } = this.state

    const opts = options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))

    return (
      <FormControl
        variant="outlined"
        style={{ width: '100%' }}
        disabled={disabled}
      >
        <InputLabel
          ref={ref => {
            this.InputLabelRef = ref
          }}
          htmlFor={id}
        >
          {name}
        </InputLabel>
        <MuiSelect
          value={value}
          onChange={this.handleChange}
          input={<OutlinedInput labelWidth={labelWidth} name={name} id={id} />}
        >
          {opts}
        </MuiSelect>
      </FormControl>
    )
  }
}
