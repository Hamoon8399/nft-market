import React, { Component } from "react";
import { categories, PAGES } from "../../constants";
import Card from "./card";
import { Container, Row } from "react-bootstrap";

export default class Exchanges extends Component {
  constructor() {
    super();
    this.state = {
      currentCategory: categories[0],
      NFTs: [],
      viewNFTs: [],
    };
  }

  componentDidMount() {
    const { contract } = this.props;
    contract.getExchanges().then((NFTs) => {
      console.log("NFTs", NFTs);
      const sortNFTs = NFTs.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      this.setState({
        NFTs: sortNFTs,
        viewNFTs: sortNFTs,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentCategory !== this.state.currentCategory) {
      if (this.state.currentCategory == categories[0]) {
        this.setState({
          viewNFTs: this.state.NFTs,
        });
      } else {
        this.setState({
          viewNFTs: this.state.NFTs.filter((nft) => {
            return nft.item.category == this.state.currentCategory;
          }),
        });
      }
    }
  }

  forwardDetail = (nft) => {
    this.props.setCurrentPage(PAGES.detail);
    this.props.setCurrentDetail(nft);
  };

  render() {
    const { currentCategory, viewNFTs } = this.state;
    return (
      <>
        <div className="title-page">Explore Anime Collections</div>
        <div>
          <div className="categories-container">
            <ul className="categories">
              {categories.map((category, index) => {
                return (
                  <li
                    onClick={() => {
                      this.setState({
                        currentCategory: category,
                      });
                    }}
                    key={index}
                  >
                    <span>{category}</span>
                    <div
                      className="under"
                      style={{
                        display: currentCategory == category ? "block" : "none",
                      }}
                    ></div>
                  </li>
                );
              })}
            </ul>
          </div>
          <Container fluid>
            <Row className="container-nfts">
              {viewNFTs.map((viewNFT, index) => {
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
        </div>
      </>
    );
  }
}
