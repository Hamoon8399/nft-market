import React, { Component } from "react";
import logo from "./assets/images/logo.png";
import PropTypes from "prop-types";
import "regenerator-runtime/runtime";
import "./assets/css/styles.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import { categories, categories2, PAGES } from "./constants";
import Exchanges from "./components/exchanges";
import Profile from "./components/profile";
import Detail from "./components/detail";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Modal, Button, Form, FormControl } from "react-bootstrap";
import { uploadImage } from "./utils";
import { sha256 } from "js-sha256";

const emptyModal = {
  createdBy: "",
  createdAt: 0,
  token: "",
  item: {
    url: "",
    category: categories2[0],
    description: "",
    name: "",
  },
  value: 0,
  owner: "",
  sale: "1",
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: PAGES.exchanges,
      currentDetail: {},
      currentProfile: {},
      isVisible: false,
      NFTModal: emptyModal,
    };
  }

  setCurrentProfile = (profile) => {
    this.setState({
      currentProfile: profile,
    });
  };

  setCurrentPage = (page) => {
    this.setState({
      currentPage: page,
    });
  };

  setCurrentDetail = (detail) => {
    this.setState({
      currentDetail: detail,
    });
  };

  renderPage = () => {
    const { contract, currentUser, wallet } = this.props;
    const { currentPage, currentDetail, currentProfile } = this.state;
    switch (currentPage) {
      case PAGES.exchanges:
        return (
          <Exchanges
            contract={contract}
            currentUser={currentUser}
            wallet={wallet}
            setCurrentPage={this.setCurrentPage}
            setCurrentProfile={this.setCurrentProfile}
            setCurrentDetail={this.setCurrentDetail}
            currentPage={currentPage}
            currentDetail={currentDetail}
            currentProfile={currentProfile}
          />
        );

      case PAGES.profile:
        return (
          <Profile
            contract={contract}
            currentUser={currentUser}
            wallet={wallet}
            setCurrentPage={this.setCurrentPage}
            setCurrentProfile={this.setCurrentProfile}
            setCurrentDetail={this.setCurrentDetail}
            currentPage={currentPage}
            currentDetail={currentDetail}
            currentProfile={currentProfile}
          />
        );

      case PAGES.detail:
        return (
          <Detail
            contract={contract}
            currentUser={currentUser}
            wallet={wallet}
            setCurrentPage={this.setCurrentPage}
            setCurrentProfile={this.setCurrentProfile}
            setCurrentDetail={this.setCurrentDetail}
            currentPage={currentPage}
            currentDetail={currentDetail}
            currentProfile={currentProfile}
          />
        );

      default:
        return (
          <Exchanges
            contract={contract}
            currentUser={currentUser}
            wallet={wallet}
            setCurrentPage={this.setCurrentPage}
            setCurrentProfile={this.setCurrentProfile}
            setCurrentDetail={this.setCurrentDetail}
            currentPage={currentPage}
            currentDetail={currentDetail}
            currentProfile={currentProfile}
          />
        );
        break;
    }
  };

  createArt = () => {
    console.log("this.state.NFTModal", this.state.NFTModal);
    if (
      this.state.NFTModal.item.url == "" ||
      this.state.NFTModal.item.name == ""
    ) {
      alert("Invalid");
    } else {
      const { contract, currentUser } = this.props;
      contract
        .mintNft({
          createdAt: Date.now().toString(),
          item: this.state.NFTModal.item,
          value: this.state.NFTModal.value,
          token: sha256(
            JSON.stringify({
              ...this.state.NFTModal.item,
              createdBy: currentUser.accountId,
              createdAt: Date.now,
            })
          ),
        })
        .then((response) => {
          window.location.reload();
        });
    }
  };

  render() {
    const { wallet, currentUser } = this.props;
    const { isVisible } = this.state;
    console.log("item", this.state.NFTModal);
    console.log("this.state.NFTModal.sale == 0 ? false : true",this.state.NFTModal.sale == "0" ? false : true);
    return (
      <>
        <Modal
          show={isVisible}
          onHide={() => {
            this.setState({ isVisible: false, NFTModal: emptyModal });
          }}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New NFT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {this.state.NFTModal.item.url !== "" ? (
                <Form.Group className="mb-3 d-flex justify-content-center">
                  <img
                    src={this.state.NFTModal.item.url}
                    style={{ maxWidth: "80%" }}
                  />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Art</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={async (e) => {
                      const url = await uploadImage(e.target.files);
                      console.log("url", url);
                      this.setState({
                        NFTModal: {
                          ...this.state.NFTModal,
                          item: { ...this.state.NFTModal.item, url },
                        },
                      });
                    }}
                  />
                </Form.Group>
              )}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="My Art"
                  onChange={(e) => {
                    this.setState({
                      NFTModal: {
                        ...this.state.NFTModal,
                        item: {
                          ...this.state.NFTModal.item,
                          name: e.target.value,
                        },
                      },
                    });
                  }}
                  value={this.state.NFTModal.item.name}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Category</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => {
                    this.setState({
                      NFTModal: {
                        ...this.state.NFTModal,
                        item: {
                          ...this.state.NFTModal.item,
                          category: e.target.value,
                        },
                      },
                    });
                  }}
                  value={this.state.NFTModal.item.category}
                >
                  {categories2.map((category, index) => {
                    return (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) => {
                    this.setState({
                      NFTModal: {
                        ...this.state.NFTModal,
                        item: {
                          ...this.state.NFTModal.item,
                          description: e.target.value,
                        },
                      },
                    });
                  }}
                  value={this.state.NFTModal.item.description}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    this.setState({
                      NFTModal: {
                        ...this.state.NFTModal,
                        value: e.target.value,
                      },
                    });
                  }}
                  value={this.state.NFTModal.value}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ isVisible: false, NFTModal: emptyModal });
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                this.createArt();
              }}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>
        <header>
          <div></div>
          <img
            src={logo}
            className="logo"
            onClick={() => {
              this.setCurrentPage(PAGES.exchanges);
            }}
          />
          <div className="auth-icon-container">
            {wallet.isSignedIn() ? (
              <>
                <div
                  className="auth-icon"
                  onClick={() => {
                    this.setState({
                      isVisible: true,
                      NFTModal: {
                        ...emptyModal,
                      },
                    });
                  }}
                >
                  <AddCircleOutlineIcon className="profile header-icon" />
                  <span>{"Create"}</span>
                </div>
                <div
                  className="auth-icon"
                  onClick={() => {
                    console.log("currentUser", currentUser);
                    this.setCurrentProfile(currentUser);
                    this.setCurrentPage(PAGES.profile);
                  }}
                >
                  <AccountCircleOutlinedIcon className="profile header-icon" />
                  <span>{currentUser.accountId}</span>
                </div>
                <div
                  className="auth-icon"
                  onClick={() => {
                    wallet.signOut();
                    window.location.replace(
                      window.location.origin + window.location.pathname
                    );
                  }}
                >
                  <ExitToAppIcon className="header-icon" />
                  <span>{"Sign Out"}</span>
                </div>
              </>
            ) : (
              <LoginIcon
                className="header-icon"
                onClick={() => {
                  wallet.requestSignIn(
                    nearConfig.contractName,
                    "NEAR Guest Book"
                  );
                }}
              />
            )}
          </div>
        </header>
        <main>{this.renderPage()}</main>
      </>
    );
  }
}

App.propTypes = {
  contract: PropTypes.shape({
    getNfts: PropTypes.func.isRequired,
    getExchanges: PropTypes.func.isRequired,
    getByOwner: PropTypes.func.isRequired,
    getTransactions: PropTypes.func.isRequired,
    getByCreatedBy: PropTypes.func.isRequired,
    getByUser: PropTypes.func.isRequired,
    getByToken: PropTypes.func.isRequired,
    mintNft: PropTypes.func.isRequired,
    updateNFT: PropTypes.func.isRequired,
    buyNFT: PropTypes.func.isRequired,
  }).isRequired,
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired,
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
