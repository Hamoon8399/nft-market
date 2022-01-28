import React, { Component } from "react";
import { Col } from "react-bootstrap";
import Near from "../../assets/images/near.png";

export default class Card extends Component {
  render() {
    const { nft } = this.props;
    const { item, value, owner } = nft;
    const { name, url, description, category } = item;
    return (
      <Col
        md={3}
        className="card-nft-container"
        onClick={() => {
          this.props.forwardDetail(nft);
        }}
        style={{ padding: "0px 10px" }}
      >
        <div className="card-nft">
          <div>
            <div className="value-nft-container">
              <span>
                {value}
                <img src={Near} className="coin" />
              </span>
            </div>
            <img src={url} className="avatar-nft" style={{ height: "240px" }} />
          </div>
          <div>
            <div className="avatar-user-container">
              <img
                className="avatar-user"
                src="https://lh3.googleusercontent.com/5Yq4zTYC55Ntc2KMb46quvtHkR23sEyyclexQY51jRvOpJLCqpvQ8ZZB-az5UgEVQYyuF1Wi5wXa43GrNJTqLDF8b9JZskuFsTzeqw=s100"
              />
            </div>
            <div className="name-nft-container">
              <span>{name}</span>
            </div>
            <div className="name-user-container">
              <span>by </span>
              <span className="name-user">{owner}</span>
            </div>
            <div className="description-nft-container">
              <span>{description}</span>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}
