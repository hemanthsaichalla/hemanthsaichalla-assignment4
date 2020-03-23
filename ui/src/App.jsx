
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint "no-alert": "off" */

function InventorySubhead() {
  const subhead = 'Showing all available products';
  return (
    <div>{ subhead }</div>
  );
}

function ProductRow({ product }) {
  const price = `$${product.Price}`;
  return (
    <tr>
      <td id="body_pro_id">{product.id}</td>
      <td>{product.Name}</td>
      <td>{price}</td>
      <td>{product.Category}</td>
      <td><a href={product.Image} target="_blank" rel="noopener noreferrer">View</a></td>
    </tr>
  );
}

function ProductTable({ products }) {
  const productRows = products.map(product => (
    <ProductRow key={product.id} product={product} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th id="head_pro_id">id</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const pricedollar = form.priceper.value;
    const price = pricedollar.replace('$', '');
    const product = {
      Name: form.name.value,
      Category: form.category.value,
      Price: price,
      Image: form.image_url.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    form.reset();
  }

  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <div className="grid_container">
          <div>
            <h2>Category</h2>
            <select type="text" name="category" selectedindex={1}>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <h3>Price Per Unit</h3>
            <input type="text" name="priceper" defaultValue="$" />
          </div>
          <div>
            <h3>Product Name</h3>
            <input type="text" name="name" />
          </div>
          <div>
            <h3>Image URL</h3>
            <input type="text" name="image_url" />
          </div>
        </div>
        <br />
        <button type="submit">Add Product</button>
      </form>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  const response = await fetch(window.ENV.UI_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  return result.data;
}

class MyProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    const data = await graphQLFetch(query);
    this.setState({ products: data.productList });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    await graphQLFetch(query, { product });
    this.retrieveData();
  }

  render() {
    const head = 'My Company Inventory';
    const addhead = 'Add a new product to inventory';
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>{ head }</h1>
        <InventorySubhead />
        <hr />
        <br />
        <ProductTable products={products} />
        <br />
        <h3>{ addhead }</h3>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}

const element = <MyProductList />;
ReactDOM.render(element, document.getElementById('contents'));
