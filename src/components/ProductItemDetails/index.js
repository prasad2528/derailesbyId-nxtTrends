import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    quantity: 1,
    showSimilarProducts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    description: data.description,
    price: data.price,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updateSimilarProducts = fetchedData.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )
      this.setState({
        productData: updatedData,
        showSimilarProducts: updateSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, showSimilarProducts} = this.state
    console.log(productData)
    const {
      title,
      price,
      imageUrl,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productData
    return (
      <div className="product-container">
        <div className="card-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/- </p>
            <div className="product-reviews">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="product-review">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-available">
              <span className="span">Available: </span>
              {availability}
            </p>
            <p className="product-available">
              <span className="span">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="quantity-container">
              <button
                className="quantity-btn"
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
                aria-label="Decrease Quantity"
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                className="quantity-btn"
                type="button"
                onClick={this.onIncrement}
                data-testid="plus"
                aria-label="Increase Quantity"
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button className="button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="main-heading">Similar Products</h1>
          <ul className="products-list-cont">
            {showSimilarProducts.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                similarProductDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFilteredAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="item-container">{this.renderFilteredAllProducts()}</div>
      </>
    )
  }
}
export default ProductItemDetails
