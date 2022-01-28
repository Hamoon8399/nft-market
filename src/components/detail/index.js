import React, { Component } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import "chart.js/auto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "./card";
import { PAGES } from "../../constants";
import Big from "big.js";
const BOATLOAD_OF_GAS = Big(5)
  .times(10 ** 13)
  .toFixed();
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Value fluctuations",
    },
  },
};

export default class Detail extends Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      NFTs: [],
    };
  }
  componentDidMount() {
    const { currentDetail } = this.props;
    const { contract } = this.props;
    console.log("currentDetail", currentDetail);
    contract.getByToken({ token: currentDetail.token }).then((transactions) => {
      console.log("transactions", transactions);
      this.setState({
        transactions,
      });
    });
    contract.getNfts({}).then((NFTs) => {
      this.setState({
        NFTs: NFTs.filter((NFT) => {
          return (
            NFT.item.category == currentDetail.item.category &&
            NFT.token !== currentDetail.token
          );
        }),
      });
    });
  }

  forwardDetail = (nft) => {
    this.props.setCurrentPage(PAGES.detail);
    this.props.setCurrentDetail(nft);
  };

  buyArt = () => {
    const { wallet, currentDetail } = this.props;

    if (wallet.isSignedIn()) {
      const { contract } = this.props;
      contract
        .buyNFT(
          {
            token: currentDetail.token.toString(),
            timeStamp: Date.now().toString(),
          },
          BOATLOAD_OF_GAS,
          Big(currentDetail.value.toString())
            .times(10 ** 24)
            .toFixed()
        )
        .then((status) => {
          console.log("status", status);
          // window.location.reload();
        });
    } else {
      wallet.requestSignIn(nearConfig.contractName, "NEAR Guest Book");
    }
  };

  render() {
    const { currentDetail } = this.props;
    const { NFTs, transactions } = this.state;
    return (
      <>
        <Container className="currentDetail-container">
          <Row>
            <Col md={6}>
              <img src={currentDetail.item.url} className="image-nft" />
            </Col>
            <Col className="detail-nft" md={6}>
              <div className="detail-name-nft">
                <h2>{currentDetail.item.name}</h2>
              </div>
              <div className="detail-category-nft" onClick={() => {}}>
                <span>{currentDetail.item.category}</span>
              </div>
              <div className="detail-common-nft">
                <span>Owned by </span>
                <span className="detail-owner-nft">{currentDetail.owner}</span>
              </div>
              <div className="detail-common-nft ">
                <span>Created by </span>
                <span className="detail-createdBy-nft">
                  {currentDetail.createdBy}
                </span>
              </div>
              <div className="detail-common-nft detail-createdAt-nft">
                <span>Created at </span>
                <span>
                  {new Date(parseInt(currentDetail.createdAt)).toString()}
                </span>
              </div>
              <div className="detail-common-nft detail-value-nft">
                <span>Price: </span>
                <span>{currentDetail.value}</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#111618"></circle>
                  <g clip-path="url(#clip0000000003)">
                    <path
                      d="M20.8422 8.84471L17.4978 13.776C17.4501 13.847 17.43 13.9328 17.4411 14.0174C17.4522 14.102 17.4938 14.1798 17.5582 14.2363C17.6225 14.2928 17.7053 14.3243 17.7913 14.3249C17.8772 14.3254 17.9604 14.2951 18.0256 14.2395L21.3178 11.4036C21.3371 11.3865 21.361 11.3753 21.3866 11.3714C21.4122 11.3675 21.4383 11.3711 21.4619 11.3818C21.4855 11.3924 21.5054 11.4096 21.5193 11.4314C21.5331 11.4531 21.5403 11.4783 21.54 11.504V20.3824C21.54 20.4095 21.5316 20.4361 21.5158 20.4583C21.5001 20.4806 21.4779 20.4975 21.4522 20.5068C21.4265 20.516 21.3985 20.5172 21.3721 20.5102C21.3456 20.5031 21.322 20.4882 21.3044 20.4673L11.3533 8.63726C11.1933 8.44956 10.994 8.29873 10.7693 8.19525C10.5446 8.09178 10.2999 8.03815 10.0522 8.03809H9.70444C9.2524 8.03809 8.81887 8.21642 8.49922 8.53386C8.17957 8.8513 8 9.28185 8 9.73078V22.2351C8 22.684 8.17957 23.1145 8.49922 23.432C8.81887 23.7494 9.2524 23.9277 9.70444 23.9277V23.9277C9.99591 23.9278 10.2825 23.8537 10.537 23.7125C10.7914 23.5713 11.0051 23.3677 11.1578 23.1211L14.5022 18.1898C14.5499 18.1188 14.57 18.033 14.5589 17.9484C14.5478 17.8638 14.5062 17.7861 14.4418 17.7295C14.3775 17.673 14.2947 17.6415 14.2087 17.641C14.1228 17.6404 14.0396 17.6707 13.9744 17.7264L10.6822 20.5622C10.6629 20.5794 10.639 20.5906 10.6134 20.5944C10.5878 20.5983 10.5617 20.5947 10.5381 20.5841C10.5145 20.5734 10.4946 20.5562 10.4807 20.5345C10.4669 20.5128 10.4597 20.4875 10.46 20.4618V11.5813C10.46 11.5541 10.4684 11.5276 10.4842 11.5053C10.4999 11.483 10.5221 11.4661 10.5478 11.4568C10.5735 11.4476 10.6015 11.4464 10.6279 11.4534C10.6544 11.4605 10.678 11.4755 10.6956 11.4963L20.6456 23.3286C20.8056 23.5163 21.0049 23.6671 21.2296 23.7706C21.4543 23.874 21.699 23.9277 21.9467 23.9277H22.2944C22.5184 23.9279 22.7401 23.8842 22.947 23.7992C23.154 23.7142 23.342 23.5895 23.5004 23.4324C23.6588 23.2752 23.7844 23.0885 23.8702 22.8831C23.9559 22.6776 24 22.4574 24 22.2351V9.73078C24 9.28185 23.8204 8.8513 23.5008 8.53386C23.1811 8.21642 22.7476 8.03809 22.2956 8.03809C22.0041 8.03801 21.7175 8.11211 21.4631 8.25332C21.2086 8.39453 20.9949 8.59814 20.8422 8.84471V8.84471Z"
                      fill="white"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip00033">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(8 7.9834)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="detail-common-nft">
                <span>Status: </span>
                {currentDetail.sale == "1" ? (
                  <span className="saling">Saling</span>
                ) : (
                  <span className="not-sale">Not Sale</span>
                )}
              </div>
              <div className="detail-common-nft detail-description-nft-container">
                <div className="detail-description-nft-title">
                  <DescriptionIcon />
                  <span>Description</span>
                </div>
                <div className="detail-description-nft-content">
                  <span>{currentDetail.item.description}</span>
                </div>
              </div>
              <div className="detail-common-nft detail-buy-nft-container">
                <div className="detail-buy-nft-content">
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => {
                      this.buyArt();
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="transactions-container">
          <h3 className="transactions-container-title">Transactions</h3>
          <Row>
            <Col md={6}>
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
                  {transactions.map((transaction, index) => {
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
            </Col>
            <Col md={6}>
              <Line
                options={{ ...options }}
                data={{
                  labels: this.state.transactions
                    .map((transaction) => transaction.timeStamp)
                    .map((label) => {
                      return new Date(parseInt(label))
                        .toISOString()
                        .split("T")[0];
                    }),
                  datasets: [
                    {
                      label: "Price",
                      data: this.state.transactions
                        .map((transaction) => transaction.timeStamp)
                        .map((label) => {
                          console.log("label");
                          return transactions.find(
                            (transaction) => transaction.timeStamp == label
                          ).value;
                        }),
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                  ],
                }}
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <h3 className="same-category">Same Category</h3>
          </Row>
          <Row>
            {NFTs.map((viewNFT, index) => {
              return (
                <Card
                  nft={viewNFT}
                  key={index}
                  forwardDetail={this.forwardDetail}
                />
              );
            })}
          </Row>
        </Container>
      </>
    );
  }
}
