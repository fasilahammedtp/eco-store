import axios from "axios";

const BASE_URL = "http://localhost:5000";


export const getPlants = () => axios.get(`${BASE_URL}/plants`);
export const getEcoProducts = () => axios.get(`${BASE_URL}/ecoProducts`);
export const getTerrariums = () => axios.get(`${BASE_URL}/terrariums`);

//fetches all cart items
export const getCart = () => axios.get(`${BASE_URL}/cart`);


//fetch cart
export const addToCart = async (item, userId) => {
  const cart = await axios.get(`${BASE_URL}/cart`);

  const productId = item.productId || item.id;

  const existing = cart.data.find(
    i => i.productId === productId && i.userId === userId
  );

  if (existing) {
    return;
  }

  return axios.post(`${BASE_URL}/cart`, {
    userId: userId,          //  IMPORTANT
    productId: productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: 1
  });
};


export const removeFromCart = (id) =>
  axios.delete(`${BASE_URL}/cart/${id}`);

export const updateCartQty = (id, quantity) =>
  axios.patch(`${BASE_URL}/cart/${id}`, { quantity });


export const getWishlist = () => axios.get(`${BASE_URL}/wishlist`);

export const addToWishlist = (item,userId) =>
  axios.post(`${BASE_URL}/wishlist`, {
    userId:userId,
    productId: item.productId || item.id,   // original product id
    name: item.name,
    price: item.price,
    image: item.image
  });


export const removeFromWishlist = (id) =>
  axios.delete(`${BASE_URL}/wishlist/${id}`);




// Orders
export const createOrder = (order) =>
  axios.post(`${BASE_URL}/orders`, order);

export const getOrders = () =>
  axios.get(`${BASE_URL}/orders`);


// register
export const registerUser = (user) =>
  axios.post(`${BASE_URL}/users`, {
    ...user,
    role: "user",
    isBlocked: false
  });


//login
export const getUsers = () =>
  axios.get(`${BASE_URL}/users`);


//clear cart
export const clearCart = async () => {
  const cart = await axios.get("http://localhost:5000/cart");
  await Promise.all(
    cart.data.map(item =>
      axios.delete(`http://localhost:5000/cart/${item.id}`)
    )
  );
};

//clear wishlist
export const clearWishlist = async () => {
  const wish = await axios.get("http://localhost:5000/wishlist");
  await Promise.all(
    wish.data.map(item =>
      axios.delete(`http://localhost:5000/wishlist/${item.id}`)
    )
  );
};


