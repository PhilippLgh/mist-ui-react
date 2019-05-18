import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import semver from 'semver'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import RefreshIcon from '@material-ui/icons/Refresh'
import WarningIcon from '@material-ui/icons/Warning'
import amber from '@material-ui/core/colors/amber'
import Spinner from '../../shared/Spinner'
import Notification from '../../shared/Notification'
import { setRelease } from '../../../store/client/actions'
import VersionListItem from './VersionListItem'

const lightGrey = 'rgba(0,0,0,0.25)'

const styles = () => ({
  refreshIcon: {
    fontSize: 22,
    color: lightGrey,
    marginLeft: 5,
    verticalAlign: 'middle',
    marginBottom: 4,
    visibility: 'hidden'
  },
  versionsAvailable: {
    '&:hover': {
      cursor: 'pointer'
    },
    '&:hover $refreshIcon': {
      visibility: 'visible'
    }
  },
  warning: {
    backgroundColor: amber[700],
    opacity: 0.9,
    margin: '10px 0 15px 0'
  },
  warningIcon: {
    fontSize: 19,
    verticalAlign: 'middle',
    marginBottom: 2
  }
})

class VersionList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleReleaseSelect: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    release: PropTypes.object
  }

  state = {
    releases: [],
    localReleaseCount: 0,
    loadingReleases: false,
    downloadError: null
  }

  componentDidMount = async () => {
    this.loadReleases()
  }

  componentWillReceiveProps({ client: nextClient }) {
    const { client: oldClient } = this.props
    if (oldClient && nextClient !== oldClient) {
      // this.loadLocalReleases()
      this.setState({ releases: [] })
      this.loadReleases(nextClient)
    }
  }

  dismissDownloadError = () => {
    this.setState({ downloadError: null })
  }

  loadReleases = async client => {
    // eslint-disable-next-line
    client = client || this.props.client
    this.setState({ loadingReleases: true })
    const localReleases = {}
    // console.time('load releases')
    let releases = await client.getReleases()
    // console.timeEnd('load releases')
    // console.time('dedupe')
    let count = 0
    releases.forEach(r => {
      if (!r.remote) {
        count += 1
        localReleases[r.fileName] = r
      }
    })
    releases = releases.filter(r => !r.remote || !localReleases[r.fileName])
    // console.timeEnd('dedupe') // for 132 -> 83 ms
    this.setState(
      { releases, loadingReleases: false, localReleaseCount: count },
      () => {
        // Set first local release as active
        // TODO: revisit after redux-persist reintroduced
        const firstLocalRelease = releases.find(release => {
          return !release.remote
        })
        if (firstLocalRelease) {
          this.handleReleaseSelect(firstLocalRelease)
        }
      }
    )
  }

  isLocalRelease = release => {
    return !release.remote
  }

  renderVersionsAvailable = () => {
    const { classes } = this.props
    const { loadingReleases, releases, localReleaseCount } = this.state

    /*
    if (releases.length === 0) {
      return <Spinner style={{ margin: '20px 0' }} />
    }
    */

    return (
      <div>
        {loadingReleases && (
          <Typography variant="h6">
            Loading versions...
            <RemoteReleaseLoadingSpinner size={18} thickness={4} />
          </Typography>
        )}
        {!loadingReleases && (
          <Typography
            variant="h6"
            onClick={this.handleRefresh}
            classes={{ root: classes.versionsAvailable }}
          >
            {releases.length} versions available
            <RefreshIcon classes={{ root: classes.refreshIcon }} />
          </Typography>
        )}
        <Typography>
          <StyledDownloadedVersions>
            {localReleaseCount} versions downloaded
          </StyledDownloadedVersions>
        </Typography>
      </div>
    )
  }

  handleRefresh = () => {
    this.loadReleases()
  }

  renderWarnings = () => {
    // TODO:
    // return <div>{this.renderLatestVersionWarning()}</div>
  }

  renderLatestVersionWarning = () => {
    const { classes, release } = this.props
    const { releases } = this.state
    if (!release || !releases.length) {
      return null
    }
    const latestRelease = this.allReleases()[0]
    const latestVersion = latestRelease.version
    const selectedVersion = release.version
    if (semver.compare(selectedVersion, latestVersion)) {
      return (
        <SnackbarContent
          classes={{ root: classes.warning }}
          message={
            <span>
              <WarningIcon classes={{ root: classes.warningIcon }} /> You are
              using an older version of Geth ({selectedVersion})<br />
              New releases contain performance and security enhancements.
            </span>
          }
          action={
            <Button
              onClick={() => {
                this.handleReleaseSelect(latestRelease)
              }}
            >
              Use {latestVersion}
            </Button>
          }
        />
      )
    }
    return null
  }

  isSelectedRelease = selectedRelease => {
    const { release } = this.props
    if (!selectedRelease) return false
    return release.fileName === selectedRelease.fileName
  }

  handleReleaseSelect = release => {
    const { client, dispatch, handleReleaseSelect } = this.props
    dispatch(setRelease(client.name, release))
    handleReleaseSelect(release)
  }

  handleReleaseDownloaded = release => {
    const releaseDownloaded = { ...release, remote: false }
    const { releases, localReleaseCount } = this.state
    const index = releases.findIndex(r => r.fileName === release.fileName)
    // releases.splice(index, 0, releaseDownloaded)
    releases[index] = releaseDownloaded
    this.setState(
      {
        releases: [...releases],
        localReleaseCount: localReleaseCount + 1
      },
      () => {
        this.handleReleaseSelect(release)
      }
    )
  }

  renderDownloadError = () => {
    const { downloadError } = this.state
    if (downloadError) {
      return (
        <Notification
          type="error"
          message={downloadError}
          onDismiss={this.dismissDownloadError}
        />
      )
    }
    return null
  }

  renderVersionList = () => {
    const { client } = this.props
    const { releases } = this.state
    const renderListItems = () => {
      const list = releases.map((release, i) => {
        return (
          <VersionListItem
            client={client}
            release={release}
            key={i}
            isSelectedRelease={this.isSelectedRelease}
            handleReleaseSelect={this.handleReleaseSelect}
            handleDownloadError={downloadError =>
              this.setState({ downloadError })
            }
            handleReleaseDownloaded={this.handleReleaseDownloaded}
          />
        )
      })
      return list
    }
    return (
      <StyledList data-test-id="version-list">{renderListItems()}</StyledList>
    )
  }

  render() {
    return (
      <div>
        {this.renderVersionsAvailable()}
        {this.renderWarnings()}
        {this.renderDownloadError()}
        {this.renderVersionList()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    release: state.client[state.client.selected].release
  }
}
export default connect(mapStateToProps)(withStyles(styles)(VersionList))

const StyledList = styled(List)`
  min-height: 200px;
  max-height: calc(100vh - 295px);
  overflow-y: scroll;
`

const RemoteReleaseLoadingSpinner = styled(Spinner)`
  margin-left: 10px;
`

const StyledDownloadedVersions = styled.span`
  color: lightGrey;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
`
