import React, { Component } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Card from "../exchanges/card";
import Card2 from "./card";
import { Table, Container, Row, Modal, Button, Form } from "react-bootstrap";
import { PAGES } from "../../constants";
import Big from "big.js";
import BgBanner from "../../assets/images/bg-banner.png";

const BOATLOAD_OF_GAS = Big(5)
  .times(10 ** 13)
  .toFixed();

const tabs = ["Collected", "Created", "Transactions"];

const emptyModal = {
  createdBy: "",
  createdAt: 0,
  token: "",
  item: {
    url: "",
    category: "",
    description: "",
    name: "",
  },
  value: 0,
  owner: "",
  sale: false,
};

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: tabs[0],
      NFTs: [],
      transactions: [],
      isVisible: false,
      NFTModal: emptyModal,
    };
  }

  componentDidMount() {
    const { contract, currentProfile } = this.props;
    console.log("currentProfile", currentProfile);
    contract.getByOwner({ userId: currentProfile.accountId }).then((NFTs) => {
      console.log("NFTs", NFTs);
      this.setState({
        NFTs,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { contract, currentProfile } = this.props;
    if (prevState.currentTab !== this.state.currentTab) {
      switch (this.state.currentTab) {
        case tabs[0]:
          contract
            .getByOwner({ userId: currentProfile.accountId })
            .then((NFTs) => {
              this.setState({
                NFTs,
              });
            });
          break;
        case tabs[1]:
          contract
            .getByCreatedBy({ createdBy: currentProfile.accountId })
            .then((NFTs) => {
              this.setState({
                NFTs,
              });
            });
          break;
        case tabs[2]:
          contract
            .getByUser({ userId: currentProfile.accountId })
            .then((transactions) => {
              console.log("transactions", transactions);
              this.setState({
                transactions,
              });
            });
        default:
          break;
      }
    }
  }

  forwardDetail = (nft) => {
    this.props.setCurrentPage(PAGES.detail);
    this.props.setCurrentDetail(nft);
  };

  editNFT = (nft) => {
    this.setState({
      NFTModal: nft,
      isVisible: true,
    });
  };

  redirectProfile = (profile) => {
    this.props.setCurrentPage(PAGES.profile);
    this.props.setCurrentProfile(profile);
  };

  renderContent = () => {
    switch (this.state.currentTab) {
      case tabs[0]:
        return (
          <Container fluid>
            <Row className="container-nfts">
              {this.state.NFTs.map((NFT, index) => {
                return (
                  <Card2
                    nft={NFT}
                    key={index}
                    forwardDetail={this.forwardDetail}
                    editNFT={this.editNFT}
                  />
                );
              })}
            </Row>
          </Container>
        );

      case tabs[1]:
        return (
          <Container fluid>
            <Row className="container-nfts">
              {this.state.NFTs.map((NFT, index) => {
                return (
                  <Card
                    nft={NFT}
                    key={index}
                    forwardDetail={this.forwardDetail}
                    redirectProfile={this.redirectProfile}
                  />
                );
              })}
            </Row>
          </Container>
        );
      case tabs[2]:
        return (
          <Container>
            <Table
              striped
              bordered
              hover
              size="sm"
              style={{ marginTop: "65px" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {this.state.transactions.map((transaction, index) => {
                  return (
                    <tr>
                      <td>{index}</td>
                      <td>
                        {new Date(parseInt(transaction.timeStamp)).toString()}
                      </td>
                      <td>{transaction.from}</td>
                      <td>{transaction.to}</td>
                      <td>{transaction.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        );
    }
  };

  updateArt = () => {
    const { contract } = this.props;
    const { NFTModal } = this.state;
    console.log("NFTModal.sale", NFTModal);
    contract
      .updateNFT(
        {
          token: NFTModal.token,
          sale: NFTModal.sale.toString(),
          value: NFTModal.value.toString(),
        },
        BOATLOAD_OF_GAS
      )
      .then((res) => {
        console.log("res", res);
        window.location.reload()
      });
  };

  render() {
    const { currentTab, isVisible } = this.state;
    const { currentProfile } = this.props;
    console.log("this.state", this.state.NFTModal);
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
            <Modal.Title>Update NFT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 d-flex justify-content-center">
                <img
                  style={{ maxWidth: "80%" }}
                  src={this.state.NFTModal.item.url}
                />
              </Form.Group>
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
                  disabled
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="My Art"
                  value={this.state.NFTModal.item.category}
                  disabled
                />
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
                  disabled
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
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Sale"
                  checked={this.state.NFTModal.sale == "0" ? false : true}
                  onClick={() => {
                    this.setState({
                      NFTModal: {
                        ...this.state.NFTModal,
                        sale: this.state.NFTModal.sale == "0" ? "1" : "0",
                      },
                    });
                  }}
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
                this.updateArt();
              }}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="profile-banner-container">
          <div className="baner-profile">
            {currentProfile.accountId.split(".")[0].toUpperCase()}
          </div>
          <img className="profile-banner" src={BgBanner} />
        </div>
        <div className="profile-avatar-container">
          <div className="avatar-profile">
            {currentProfile.accountId.slice(0, 1).toUpperCase()}
          </div>
        </div>
        <div className="profile-name-container">
          <span className="profile-name">{currentProfile.accountId}</span>
          <CheckCircleOutlineIcon
            color="primary"
            style={{ marginLeft: "10px" }}
          />
        </div>
        <div className="profile-name-tabs">
          <div className="categories-container">
            <ul className="categories">
              {tabs.map((tab, index) => {
                return (
                  <li
                    onClick={() => {
                      this.setState({
                        currentTab: tab,
                      });
                    }}
                    key={index}
                    style={{ fontSize: "30px", margin: "0px 10px" }}
                  >
                    <span>{tab}</span>
                    <div
                      className="under"
                      style={{
                        display: currentTab == tab ? "block" : "none",
                      }}
                    ></div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="profile-content">{this.renderContent()}</div>
        </div>
      </>
    );
  }
}
