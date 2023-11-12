// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {title, brand, imageUrl, rating, price} = similarProductDetails
  return (
    <li className="list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h2 className="similar-title">{title}</h2>
      <p className="similar-brand">by {brand}</p>
      <div className="price-cont">
        <p className="similar-price">Rs {price}/- </p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
