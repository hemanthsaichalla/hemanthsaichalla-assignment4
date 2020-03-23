/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "react/no-multi-comp": "off" */

/* eslint "no-alert": "off" */
function InventorySubhead() {
  const subhead = 'Showing all available products';
  return React.createElement("div", null, subhead);
}

function ProductRow({
  product
}) {
  // const { product } = props.product;
  const price = `$${product.Price}`;
  return React.createElement("tr", null, React.createElement("td", {
    id: "body_pro_id"
  }, product.id), React.createElement("td", null, product.Name), React.createElement("td", null, price), React.createElement("td", null, product.Category), React.createElement("td", null, React.createElement("a", {
    href: product.Image,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "View")));
}

function ProductTable({
  products
}) {
  const productRows = products.map(product => React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    id: "head_pro_id"
  }, "id"), React.createElement("th", null, "Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows));
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
      Image: form.image_url.value
    };
    const {
      createProduct
    } = this.props;
    createProduct(product);
    form.reset();
  }

  render() {
    return React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      className: "grid_container"
    }, React.createElement("div", null, React.createElement("h2", null, "Category"), React.createElement("select", {
      type: "text",
      name: "category",
      selectedindex: 1
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), React.createElement("div", null, React.createElement("h3", null, "Price Per Unit"), React.createElement("input", {
      type: "text",
      name: "priceper",
      defaultValue: "$"
    })), React.createElement("div", null, React.createElement("h3", null, "Product Name"), React.createElement("input", {
      type: "text",
      name: "name"
    })), React.createElement("div", null, React.createElement("h3", null, "Image URL"), React.createElement("input", {
      type: "text",
      name: "image_url"
    }))), React.createElement("br", null), React.createElement("button", {
      type: "submit"
    }, "Add Product"));
  }

}

async function graphQLFetch(query, variables = {}) {
  const response = await fetch(window.ENV.UI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  const result = await response.json();
  return result.data;
}

class MyProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
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
    this.setState({
      products: data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`; // const data = await graphQLFetch(query, { product });

    await graphQLFetch(query, {
      product
    });
    this.retrieveData();
  }

  render() {
    const head = 'My Company Inventory';
    const addhead = 'Add a new product to inventory';
    const {
      products
    } = this.state;
    return React.createElement(React.Fragment, null, React.createElement("h1", null, head), React.createElement(InventorySubhead, null), React.createElement("hr", null), React.createElement("br", null), React.createElement(ProductTable, {
      products: products
    }), React.createElement("br", null), React.createElement("h3", null, addhead), React.createElement("hr", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = React.createElement(MyProductList, null);
ReactDOM.render(element, document.getElementById('contents'));