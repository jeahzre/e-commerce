import { Component } from "react";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const pageNumbers = [];
    console.log(this.props);
    const { totalProducts, productsPerPage, handleSwitchPage } = this.props;
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <ul className="page-numbers">
          {
            pageNumbers.map(pageNumber => {
              return (
                <li key={pageNumber} className="page-number">
                  <button className="page-number-btn" onClick={() => handleSwitchPage(pageNumber)}>
                  {pageNumber}
                </button>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

}

export default Pagination;