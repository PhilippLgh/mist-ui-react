import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { Mist } from '../../API'
import GethConfig from './GethConfig'

const { geth } = Mist
const drawerWidth = 240

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar,
  selected: {
    '&$selected': {
      backgroundColor: '#ffffff',
      '&:hover': {
        backgroundColor: '#ffffff'
      }
    }
  }
})

class NodesTab extends Component {
  static propTypes = {
    classes: PropTypes.object,
    client: PropTypes.object
  }

  static defaultProps = {}

  static isChecked(name) {
    if (name === 'Geth') {
      const { isRunning } = geth
      return isRunning
    }
    return false
  }

  state = {
    activeItem: 'Geth',
    nodes: [{ name: 'Geth' }]
  }

  constructor(props) {
    super(props)
    this.gethConfigRef = React.createRef()
  }

  handleNodeSelect = name => {
    this.setState({ activeItem: name })
  }

  handleToggle = name => {
    if (name === 'Geth') {
      console.log(this.gethConfigRef)
      this.gethConfigRef.current.handleStartStop()
    }
  }

  render() {
    const { classes } = this.props
    const { activeItem, nodes } = this.state
    const { client } = this.props
    const { release } = client

    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          <List>
            {nodes.map(node => (
              <ListItem
                key={node.name}
                disabled={node.disabled}
                selected={node.name === activeItem}
                onClick={() => this.handleNodeSelect(node.name)}
                classes={{ selected: classes.selected }}
                button
              >
                <ListItemText primary={node.name} />
                <ListItemSecondaryAction>
                  <Switch
                    color="primary"
                    onChange={() => this.handleToggle(activeItem)}
                    checked={activeItem === 'Geth' ? geth.isRunning : false}
                    disabled={activeItem === 'Geth' ? !!release : true}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {activeItem === 'Geth' && <GethConfig ref={this.gethConfigRef} />}
        </main>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(withStyles(styles)(NodesTab))
