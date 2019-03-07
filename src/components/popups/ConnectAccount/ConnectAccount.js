import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './ConnectAccount.css'
import { Mist, i18n } from '../../../API'

const selectedAccounts = []

class ConnectAccount extends Component {
  static propTypes = {
    accounts: PropTypes.any,
    popup: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedAccount: null
    }
  }

  renderAccounts = () => {
    return selectedAccounts.map(acc => {
      return (
        <span
          key={acc.address}
          className="simptip-position-left simptip-movable"
          data-tooltip={acc.name}
        >
          {/* <Identicon seed={acc} className="dapp-large" /> */}
        </span>
      )
    })
  }

  handleAccountSelected = acc => {
    this.setState({
      selectedAccount: acc
    })
  }

  render() {
    const { accounts, popup } = this.props
    const { selectedAccount } = this.state

    const dapp = {
      name: '<dapp name>',
      icon: ''
    }

    const dappFriendlyURL = popup.args.url
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '')

    return (
      <div className="popup-windows connect-account">
        <form action="#">
          <div className="account-dapp-user-container">
            <span className="account-address">
              {selectedAccounts.length === 1
                ? selectedAccounts[0]
                : i18n.t('mist.popupWindows.connectAccount.chooseAccountTitle')}
            </span>

            <div className="account-dapp-user">
              {selectedAccounts ? (
                this.renderAccounts()
              ) : (
                <span className="user-icon no-account" />
              )}

              {dapp.icon ? (
                <img alt="" src={dapp.icon} className="app-icon" />
              ) : (
                <span className="app-icon is-empty">
                  <i className="icon-globe" />
                </span>
              )}
            </div>
            <span className="dapp-url" title={dappFriendlyURL}>
              {dappFriendlyURL}
            </span>
          </div>

          <p className="connect-account-warn-text">
            {i18n.t(
              'mist.popupWindows.connectAccount.connectAccountDescription',
              {
                dappName: dapp.name
              }
            )}
          </p>

          <ul className="dapp-account-list">
            <li>
              <button className="create-account">
                <span className="dapp-identicon dapp-small create-account-icon" />
                <h3>
                  {i18n.t('mist.popupWindows.connectAccount.createAccount')}
                </h3>
              </button>
            </li>
            {accounts.map(acc => {
              return (
                <li key={acc.address}>
                  <button
                    type="button"
                    className={acc.selected}
                    onClick={e => {
                      e.preventDefault()
                      this.handleAccountSelected(acc)
                    }}
                  >
                    {/* <Identicon seed={acc.address} className="dapp-small" /> */}
                    <h3>{acc.name}</h3>
                    <span>{acc.address}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/*
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="pin-to-sidebar"
              checked="true"
              onChange={this.handlePinAppCheckboxChanged}
            />
            <label htmlFor="pin-to-sidebar">
              {i18n.t("mist.popupWindows.connectAccount.pinToSidebar")}
            </label>
          </div>
          */}

          <div className="dapp-modal-buttons">
            <button
              className="cancel"
              type="button"
              onClick={e => {
                e.preventDefault()
                Mist.closeThisWindow()
              }}
            >
              {i18n.t('buttons.cancel')}
            </button>
            {selectedAccount ? (
              <button className="ok dapp-primary-button" type="submit">
                {i18n.t('buttons.authorize')}
              </button>
            ) : (
              <button
                className="stay-anonymous dapp-primary-button"
                type="button"
                onClick={e => {
                  e.preventDefault()
                  Mist.closeThisWindow()
                }}
              >
                {i18n.t('buttons.stayAnonymous')}
              </button>
            )}
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  }
}

export default connect(mapStateToProps)(ConnectAccount)
